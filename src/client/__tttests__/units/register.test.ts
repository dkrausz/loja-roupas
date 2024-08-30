import { container } from "tsyringe";
import { prisma } from "../../../database/prisma";
import { ClientFactory } from "../client.factories";
import { ClientServices } from "../../services";
import { AddressFactory } from "../address.factories";
import { fakerBr } from "@js-brasil/fakerbr";

describe("Unit test: register client", () => {
  beforeEach(async () => {
    await prisma.client.deleteMany();
    await prisma.store.deleteMany();
    await prisma.address.deleteMany();
  });

  test("Should be able to register a client", async () => {
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
    const validTestClient = ClientFactory.build(newStore.id);

    const createdClient = await clientServices.register(validTestClient);

    const expectedValue = {
      publicId: expect.any(String),
      name: validTestClient.name,
      email: validTestClient.email,
      birthDate: validTestClient.birthDate,
      CPF: validTestClient.CPF,
      phone: validTestClient.phone,
      storeId: newStore.id,
      address: [],
    };

    expect(createdClient).toEqual(expectedValue);
  });
});
