import { fakerBr } from "@js-brasil/fakerbr";
import { Prisma } from "@prisma/client";

export class AddressFactory {
  static build = (data: Partial<Prisma.AddressCreateInput> = {}) => {
    const fakerAddress = fakerBr.endereco();
    const newAddress = {
      street: fakerAddress.logradouro.slice(0, 255),
      number: fakerAddress.numero,
      complement: fakerAddress.complemento.slice(0, 100),
      zipCode: fakerAddress.cep,
      neighborhood: fakerAddress.bairro.slice(0, 255),
      state: fakerAddress.estado.slice(0, 20),
      city: fakerAddress.cidade.slice(0, 20),
      country: "Brasil",
      ...data,
    };

    return newAddress;
  };
}
