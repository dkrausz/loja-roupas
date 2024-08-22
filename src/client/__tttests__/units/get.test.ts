import { container } from "tsyringe";
import { prisma } from "../../../database/prisma";
import { ClientFactory } from "../client.factories";
import { ClientServices } from "../../services";
import { AddressFactory } from "../address.factories";
import { fakerBr } from "@js-brasil/fakerbr";
import { TClientRegister, TClientReturn } from "../../interfaces";

describe("Unit test: list all clients", () => {
  beforeEach(async () => {
    await prisma.client.deleteMany();
    await prisma.store.deleteMany();
    await prisma.address.deleteMany();
  });

  test("Should be able to get all registered clients", async () => {
    const clientServices = container.resolve(ClientServices);

    const newAddress = AddressFactory.build();

    const newStore = await prisma.store.create({
      data: {
        name: "Loja Teste",
        CNPJ: fakerBr.cnpj(),
        address: {
          create: newAddress,
        },
      },
    });
    const clientListTest = ClientFactory.buildMany(5, newStore.id);
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

    const getClientList = await clientServices.get();
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
        storeId: newStore.id,
        address: [],
      };
    };

    for (let i = 0; i < clientListTest.length; i++) {
      expect(getClientList[i]).toEqual(expectedValue(clientListTest[i]));
    }
    expect(clientList.length).toStrictEqual(clientListTest.length);
  });
});
