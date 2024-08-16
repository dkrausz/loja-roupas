import { fakerBr } from "@js-brasil/fakerbr";
import { faker } from "@faker-js/faker";
import { Prisma } from "@prisma/client";
import { AddressFactory } from "./address.factories";

export class StoreFactory {
  static build = (data: Partial<Prisma.StoreCreateInput> = {}) => {
    const newStore = {
      name: faker.company.name(),
      CNPJ: fakerBr.cnpj(),
      ...data,
    };

    return newStore;
  };
}
