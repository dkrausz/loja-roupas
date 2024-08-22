import { container } from "tsyringe";
import { prisma } from "../../../database/prisma";
import { ClientFactory } from "../client.factories";
import { AddressFactory } from "../address.factories";
import { fakerBr } from "@js-brasil/fakerbr";
import { loadedStore } from "../../../app";
import { initStore } from "../../../configs/initStore.config";
import { ClientServices } from "../../services";

describe("Unit test: register client", () => {
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
    container.reset();
  });

  test("Should be able to register a client", async () => {
    const clientServices = container.resolve(ClientServices);
    // const clientServices = new ClientServices();

    const validTestClient = ClientFactory.build(loadedStore.id);

    const createdClient = await clientServices.register(validTestClient);

    const expectedValue = {
      publicId: expect.any(String),
      name: validTestClient.name,
      email: validTestClient.email,
      birthDate: validTestClient.birthDate,
      CPF: validTestClient.CPF,
      phone: validTestClient.phone,
      storeId: loadedStore.id,
      address: [],
    };

    expect(createdClient).toEqual(expectedValue);
  });
});
