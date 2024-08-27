import { prisma } from "../../../database/prisma";
import { ClientFactory } from "../client.factories";
import { AddressFactory } from "../address.factories";
import { fakerBr } from "@js-brasil/fakerbr";
import { loadedStore } from "../../../app";
import { initStore } from "../../../configs/initStore.config";
import { container } from "tsyringe";
import { loginClientMock } from "../__mocks/client.mock";
import { request } from "../../../@shared/utils/request";

describe("Integration test: update client", () => {
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
    container.reset();
  });

  afterAll(async () => {
    await prisma.client.deleteMany();
    await prisma.store.deleteMany();
    await prisma.address.deleteMany();
  });

  //   autenticar antes
  // incluir autorizaçao adm (e employee?)
  test("Should be able to update the client name correctly with valid data.", async () => {
    const { token, client } = await loginClientMock();

    // await request
    //   .patch(`${endpoint}/${client.publicId}`)
    //   .set("Authorization", token)
    //   .send({ name: "Nome do Cliente Atualizado" })
    //   .expect(201)
    //   .then((response) => response);
  });

  test("Should throw erro if has no token.", async () => {
    const newValidClient = ClientFactory.build(loadedStore.id);

    const data = await request
      .post(endpoint)
      .send(newValidClient)
      .expect(201)
      .then((response) => response.body);

    await request
      .patch(`${endpoint}/${data.publicId}`)
      .send({ email: "new@mail.com" })
      .expect(401)
      .then((response) => response.body);
  });

  test("Should throw erro if token is invalid.", async () => {
    const { token, client } = await loginClientMock();

    const data = await request
      .patch(`${endpoint}/${client.publicId}`)
      .set("Authorization", "InvalidToken")
      .send({ name: "Nome do Cliente Atualizado" })
      .expect(401)
      .then((response) => response);
  });
  //   birthDate: true,
  //   phone: true,
  //   password: true,
});
