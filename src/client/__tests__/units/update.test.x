// import { container } from "tsyringe";
import { prisma } from "../../../database/prisma";
import { AddressFactory } from "../address.factories";
import { fakerBr } from "@js-brasil/fakerbr";
import { ClientFactory } from "../client.factories";
import { TClientRegister } from "../../interfaces";
import { ClientServices } from "../../services";
import { customContainer } from "../../../configs/container";
import { register } from "module";

describe("Unit test: update client data", () => {
  const mockClientServices = {
    update: jest.fn(),
    register: jest.fn(),
    getOne: jest.fn(),
    get: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    await prisma.client.deleteMany();
    await prisma.store.deleteMany();
    await prisma.address.deleteMany();

    customContainer.reset();
    customContainer.registerInstance(ClientServices, mockClientServices);
  });

  test("Should be able to update a client data", async () => {
    const clientServices = customContainer.resolve("ClientServices");
    // const clientServices = new ClientServices();
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
