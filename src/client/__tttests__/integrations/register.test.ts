import { prisma } from "../../../database/prisma";
import { request } from "../utils/request";
import { ClientFactory } from "../client.factories";
import { AddressFactory } from "../address.factories";
import { fakerBr } from "@js-brasil/fakerbr";

describe("Integration test: register client", () => {
  const endpoint = "/clients";

  const startData = async () => {
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
    return newStore.id;
  };

  beforeEach(async () => {
    await prisma.client.deleteMany();
  });

  test("Should be able to create a user correctly with valid data.", async () => {
    const newValidClient = ClientFactory.build(await startData());

    const data = await request
      .post(endpoint)
      .send(newValidClient)
      .expect(201)
      .then((response) => response.body);

    const expectResponseBody = {
      name: newValidClient.name,
      email: newValidClient.email,
      birthDate: newValidClient.birthDate.toISOString(),
      CPF: newValidClient.CPF,
      phone: newValidClient.phone,
      storeId: newValidClient.storeId,
      publicId: expect.any(String),
      address: [],
    };

    expect(data).toEqual(expectResponseBody);
  });

  test("Should throw error if invalid body data to register.", async () => {
    const invalidBodyData = {};

    const data = await request
      .post(endpoint)
      .send(invalidBodyData)
      .expect(400)
      .then((response) => response.body);
    expect(data).toBeDefined();

    const receivedKeys = Object.keys(data.errors);
    expect(receivedKeys.length).toBeGreaterThan(0);
  });

  test("Should throw error if email is already registered.", async () => {
    const newValidClient1 = ClientFactory.build(await startData());
    const newValidClient2 = {
      ...ClientFactory.build(newValidClient1.storeId),
      email: newValidClient1.email,
    };

    await request
      .post(endpoint)
      .send(newValidClient1)
      .expect(201)
      .then((response) => response.body);

    await request
      .post(endpoint)
      .send(newValidClient2)
      .expect(409)
      .then((response) => response.body);
  });

  test("Should throw error if CPF number is invalid.", async () => {
    const newInvalidCPFClient = {
      ...ClientFactory.build(await startData()),
      CPF: "12345678900",
    };

    await request
      .post(endpoint)
      .send(newInvalidCPFClient)
      .expect(417)
      .then((response) => response.body);
  });

  test("Should throw error if a CPF is already registered.", async () => {
    const newClient = ClientFactory.build(await startData());
    const newDuplicatedCPFClient = {
      ...ClientFactory.build(await startData()),
      CPF: newClient.CPF,
    };

    await request
      .post(endpoint)
      .send(newClient)
      .expect(201)
      .then((response) => response.body);

    await request
      .post(endpoint)
      .send(newDuplicatedCPFClient)
      .expect(409)
      .then((response) => response.body);
  });

  test("Should throw error if storeId is invalid.", async () => {
    const newClient = ClientFactory.build(0);

    await request
      .get(`/store/${newClient.storeId}`)
      .expect(404)
      .then((response) => response.body);
  });
});
