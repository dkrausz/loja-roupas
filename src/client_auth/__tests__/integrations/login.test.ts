import { container } from "tsyringe";
import { request } from "../../../@shared/utils/request";
import { loadedStore } from "../../../app";
import { prisma } from "../../../database/prisma";
import { initStore } from "../../../configs/initStore.config";
import { fakerBr } from "@js-brasil/fakerbr";
import { AddressFactory } from "../../../client/__tests__/address.factories";
import bcryptjs from "bcryptjs";
import { ClientFactory } from "../../../client/__tests__/client.factories";

describe("Integration test:", () => {
  const endpoint = "/login";

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
    container.reset();
  });

  afterAll(async () => {
    await prisma.client.deleteMany();
    await prisma.store.deleteMany();
    await prisma.address.deleteMany();
  });

  test("Should be able to login a client successfully and return a token.", async () => {
    const newClient = ClientFactory.build(loadedStore.id);
    const pwd: string = await bcryptjs.hash(newClient.password, 10);
    const dateValue = new Date(newClient.birthDate);

    const newClientValid = {
      ...newClient,
      birthDate: dateValue,
      password: pwd,
    };
    await prisma.client.create({ data: newClientValid });

    const loggedIn = await request
      .post(endpoint)
      .send({ email: newClient.email, password: newClient.password })
      .expect(201)
      .then((response) => response.body);

    expect(loggedIn.token).toBeDefined();
  });

  test("Should throw error if email doesn't registered.", async () => {
    await request
      .post(endpoint)
      .send({
        email: "invalido@emailqualquer.com",
        password: "não importa a senha neste caso",
      })
      .expect(404)
      .then((response) => response.body);
  });

  test("Should throw error if password is incorrect.", async () => {
    const newClient = ClientFactory.build(loadedStore.id);
    const pwd: string = await bcryptjs.hash(newClient.password, 10);
    const dateValue = new Date(newClient.birthDate);

    const newClientValid = {
      ...newClient,
      birthDate: dateValue,
      password: pwd,
    };
    await prisma.client.create({ data: newClientValid });

    await request
      .post(endpoint)
      .send({ email: newClient.email, password: "INVALID" })
      .expect(401)
      .then((response) => response.body);
  });
});
