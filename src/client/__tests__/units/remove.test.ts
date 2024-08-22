import { container } from "tsyringe";
import { prisma } from "../../../database/prisma";
import { ClientFactory } from "../client.factories";
import { AddressFactory } from "../address.factories";
import { fakerBr } from "@js-brasil/fakerbr";
import { loadedStore } from "../../../app";
import { initStore } from "../../../configs/initStore.config";
import { ClientServices } from "../../services";

describe("Unit test: remove client", () => {
  beforeAll(async () => {
    await prisma.client.deleteMany();
    await prisma.store.deleteMany();
    await prisma.address.deleteMany();

    const addressStore = AddressFactory.build();
    const newStore = await prisma.store.create({
      data: {
        name: "Loja Teste",
        CNPJ: fakerBr.cnpj(),
        address: {
          create: addressStore,
        },
      },
    });
    loadedStore.id = newStore.id;
    await initStore(loadedStore);
  });

  beforeEach(async () => {
    container.reset();
    await prisma.client.deleteMany();
  });

  test("Should be able to remove a client by publicId.", async () => {
    const clientServices = container.resolve(ClientServices);

    const clientListTest = ClientFactory.buildMany(5, loadedStore.id);
    clientListTest.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      } else {
        return 1;
      }
    });

    const clientList = await Promise.all(
      clientListTest.map(async (client) => {
        const clientx = { ...client, storeId: loadedStore.id };
        return await prisma.client.create({ data: clientx });
      })
    );
    clientList.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      } else {
        return 1;
      }
    });

    const max = 4;
    const min = 0;
    const i = Math.floor(Math.random() * (max - min + 1)) + min;
    const uuidToFind = clientList[i].publicId;

    clientListTest.splice(i, 1);

    await clientServices.remove(uuidToFind);
    const newListLength = await prisma.client.count();
    const foundClient = await prisma.client.findUnique({
      where: { publicId: uuidToFind },
    });

    expect(foundClient).toBeFalsy();
    expect(newListLength).toStrictEqual(clientListTest.length);
  });
});
