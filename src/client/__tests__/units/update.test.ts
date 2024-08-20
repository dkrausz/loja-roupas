import { container } from "tsyringe";
import { prisma } from "../../../database/prisma";
import { ClientServices } from "../../services";
import { AddressFactory } from "../address.factories";
import { fakerBr } from "@js-brasil/fakerbr";
import { ClientFactory } from "../client.factories";
import { TClientRegister } from "../../interfaces";

describe("Unit test: update client data", () => {
  beforeEach(async () => {
    await prisma.client.deleteMany();
    await prisma.store.deleteMany();
    await prisma.address.deleteMany();
  });

  test("Should be able to update a client data", async () => {
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

    const newClient = ClientFactory.build(newStore.id);

    const registeredClient = await prisma.client.create({ data: newClient });

    const updateData = {
      name: "Cintia Rodrigues",
      email: "cintia@gmail.com",
      phone: "1236345",
      birthDate: new Date("1986-10-15"),
      password: "1234Abc!",
    };
    const updatedClient = {
      ...newClient,
      ...updateData,
    };

    const updateClientServiceTest = await clientServices.update(
      registeredClient.publicId,
      updateData
    );

    const expectedValue = (client: TClientRegister) => {
      return {
        publicId: expect.any(String),
        name: client.name,
        email: client.email,
        birthDate: client.birthDate,
        CPF: client.CPF,
        phone: client.phone,
        address: [],
      };
    };

    expect(updateClientServiceTest).toEqual(expectedValue(updatedClient));
  });
});
