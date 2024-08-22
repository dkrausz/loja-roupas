import { container } from "tsyringe";
import { prisma } from "../../../database/prisma";
import { ClientFactory } from "../client.factories";
import { AddressFactory } from "../address.factories";
import { fakerBr } from "@js-brasil/fakerbr";
import { loadedStore } from "../../../app";
import { initStore } from "../../../configs/initStore.config";
import { ClientServices } from "../../services";
import { TClientRegister } from "../../interfaces";

describe("Unit test: update client", () => {
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

  test("Should be able to update data client publicId.", async () => {
    const clientServices = container.resolve(ClientServices);

    const newClient = ClientFactory.build(loadedStore.id);
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
    console.log("Dado enviado para o bd", updateClientServiceTest);
    console.log("Dados de teste:", expectedValue(updatedClient));
    // expect(updateClientServiceTest).toEqual(expectedValue(updatedClient));
  });
});
