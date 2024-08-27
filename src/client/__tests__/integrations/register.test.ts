import { prisma } from "../../../database/prisma";
import { ClientFactory } from "../client.factories";
import { AddressFactory } from "../address.factories";
import { fakerBr } from "@js-brasil/fakerbr";
import { loadedStore } from "../../../app";
import { initStore } from "../../../configs/initStore.config";
import { request } from "../../../@shared/utils/request";

describe("Integration test: register client", () => {
  const endpoint = "/clients";

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
    await prisma.client.deleteMany();
  });

  afterAll(async () => {
    await prisma.client.deleteMany();
    await prisma.store.deleteMany();
    await prisma.address.deleteMany();
  });

  test("Should be able to create a client correctly with valid data.", async () => {
    const newValidClient = ClientFactory.build(loadedStore.id);

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
      storeId: loadedStore.id,
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
    let newValidClient1;
    let newValidClient2;
    newValidClient1 = ClientFactory.build(loadedStore.id);
    newValidClient2 = {
      ...ClientFactory.build(loadedStore.id),
      email: newValidClient1.email,
    };

    await request.post(endpoint).send(newValidClient1).expect(201);

    await request
      .post(endpoint)
      .send(newValidClient2)
      .expect(409)
      .then((response) => response.body);
  });

  test("Should throw error if CPF number is invalid.", async () => {
    const newInvalidCPFClient = {
      ...ClientFactory.build(loadedStore.id),
      CPF: "12345678900",
    };

    await request
      .post(endpoint)
      .send(newInvalidCPFClient)
      .expect(417)
      .then((response) => response.body);
  });

  test("Should throw error if a CPF is already registered.", async () => {
    const newClient = ClientFactory.build(loadedStore.id);
    const newDuplicatedCPFClient = {
      ...ClientFactory.build(loadedStore.id),
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
    loadedStore.id = 0;
    const newClient = ClientFactory.build(loadedStore.id);

    await request
      .post(endpoint)
      .send(newClient)
      .expect(404)
      .then((response) => {
        response.body;
      });
  });
});
