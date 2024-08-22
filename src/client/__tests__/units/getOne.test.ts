import { container } from "tsyringe";
import { prisma } from "../../../database/prisma";
import { ClientFactory } from "../client.factories";
import { AddressFactory } from "../address.factories";
import { fakerBr } from "@js-brasil/fakerbr";
import { loadedStore } from "../../../app";
import { initStore } from "../../../configs/initStore.config";
import { ClientServices } from "../../services";

describe("Unit test: get one client", () => {
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

  test("Should be able to get one registered clients.", async () => {
    const clientServices = container.resolve(ClientServices);

    const clientListTest = ClientFactory.buildMany(5, loadedStore.id);

    const clientList = await Promise.all(
      clientListTest.map(async (client) => {
        return await clientServices.register(client);
      })
    );
    const max = 4;
    const min = 0;
    const i = Math.floor(Math.random() * (max - min + 1)) + min;
    const uuidToFind = clientList[i].publicId;

    const clientFound = await clientServices.getOne(uuidToFind);

    const expectedValue = {
      publicId: expect.any(String),
      name: clientListTest[i].name,
      email: clientListTest[i].email,
      birthDate: clientListTest[i].birthDate,
      CPF: clientListTest[i].CPF,
      phone: clientListTest[i].phone,
      storeId: loadedStore.id,
      address: [],
    };

    expect(clientFound).toEqual(expectedValue);
  });
});
