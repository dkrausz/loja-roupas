import { container } from "tsyringe";
import { prisma } from "../../../database/prisma";
import { ClientFactory } from "../client.factories";
import { AddressFactory } from "../address.factories";
import { fakerBr } from "@js-brasil/fakerbr";
import { loadedStore } from "../../../app";
import { initStore } from "../../../configs/initStore.config";
import { ClientServices } from "../../services";
import { TClientRegister, TClientReturn } from "../../interfaces";

describe("Unit test: get client", () => {
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

  test("Should be able to get all registered clients.", async () => {
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
        return await clientServices.register(client);
      })
    );

    const getClientList: TClientReturn[] = await clientServices.get();
    getClientList.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      } else {
        return 1;
      }
    });

    const expectedValue = (client: TClientRegister): TClientReturn => {
      return {
        publicId: expect.any(String),
        name: client.name,
        email: client.email,
        birthDate: client.birthDate,
        CPF: client.CPF,
        phone: client.phone,
        storeId: loadedStore.id,
        address: [],
      };
    };

    for (let i = 0; i < clientListTest.length; i++) {
      expect(getClientList[i]).toEqual(expectedValue(clientListTest[i]));
    }
    expect(clientList.length).toStrictEqual(clientListTest.length);
  });
});
