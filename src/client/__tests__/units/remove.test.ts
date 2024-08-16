import { container } from "tsyringe";
import { prisma } from "../../../database/prisma";
import { ClientServices } from "../../services";
import { AddressFactory } from "../address.factories";
import { fakerBr } from "@js-brasil/fakerbr";
import { ClientFactory } from "../client.factories";
import { TClient, TClientRegister } from "../../interfaces";

describe("Unit test: delete client", () => {
  beforeEach(async () => {
    await prisma.client.deleteMany();
    await prisma.store.deleteMany();
    await prisma.address.deleteMany();
  });

  test("Should be able to delete a user by uuid", async () => {
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
        return await prisma.client.create({ data: client });
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

    await clientServices.remove(uuidToFind);
    const newListLength = await prisma.client.count();

    clientListTest.splice(i, 1);

    // const expectedValue = (client: TClientRegister): TClient => {
    //   return {
    //     id: expect.any(Number),
    //     password: expect.any(String),
    //     publicId: expect.any(String),
    //     name: client.name,
    //     email: client.email,
    //     birthDate: client.birthDate,
    //     CPF: client.CPF,
    //     phone: client.phone,
    //     storeId: newStore.id,
    //   };
    // };

    // for (let i = 0; i < clientListTest.length; i++) {
    //   expect(clientList[i]).toEqual(expectedValue(clientListTest[i]));
    // }
    expect(newListLength).toStrictEqual(clientListTest.length);
  });
});
