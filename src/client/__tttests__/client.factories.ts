import { fakerBr } from "@js-brasil/fakerbr";
import { faker } from "@faker-js/faker";
import { TClientRegister } from "../interfaces";

export class ClientFactory {
  static build = (storeId: number) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const newClient = {
      name: (firstName + " " + lastName).slice(0, 255),
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      password: "Abc1234!",
      birthDate: new Date(
        faker.date.birthdate({ min: 18, max: 95, mode: "age" })
      ),
      CPF: fakerBr.cpf().replaceAll(".", "").replaceAll("-", ""),
      phone: faker.string.numeric({ length: { min: 10, max: 11 } }),
      storeId: storeId,
    };

    return newClient;
  };

  static buildMany = (n: number, storeId: number) => {
    const clientsList: TClientRegister[] = [];
    Array.from({ length: n }).forEach(() => {
      clientsList.push(ClientFactory.build(storeId));
    });
    return clientsList;
  };
}
