import { container } from "tsyringe";
import { prisma } from "../../../database/prisma";
import { ClientServices } from "../../services";
import { AddressFactory } from "../address.factories";
import { fakerBr } from "@js-brasil/fakerbr";
import { ClientFactory } from "../client.factories";

describe("Unit test: get one client", () => {
  beforeEach(async () => {
    await prisma.client.deleteMany();
    await prisma.store.deleteMany();
    await prisma.address.deleteMany();
  });

  test("Should be able do get one client by his uuid", async () => {
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
      storeId: newStore.id,
      address: [],
    };

    expect(clientFound).toEqual(expectedValue);
  });
});
