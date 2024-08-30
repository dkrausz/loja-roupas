import { hash } from "bcrypt";
import { TCreateEmployee, TemployeeBodyWithoutAddress } from "../../employee/interfaces";
import { ZodEnum, ZodNativeEnum } from "zod";
import { AccessLevel } from "@prisma/client";

const hashPassword = async()=>{
  const password = await hash("Teste123*", 10);
  return password;
}

export const address1 = {
  street:"Rua qualquer",
  number: 333,
  complement: "antes da ponte",
  zipCode: "04710-000",
  neighborhood: "Santo Amaro",
  state: "Sao Paulo",
  city: "Sao Paulo",
  country: "Brasil"
};

export const address2 = {
  street:"Rua do herval",
  number: 333,
  complement: "ap 400",
  zipCode: "80045-000",
  neighborhood: "Bairro Alto",
  state: "Parana",
  city: "Curitiba",
  country: "Brasil"
};

export const store ={
  name: "loja do zé",
  CNPJ:"77262040000136",
  addressId:1
  };



export const createAdmEmployee = async()=>{
  const dataValue = new Date("1988-02-14");

  const password = await hashPassword();

  const accessLevel = "ADM";

  const employeeAdm = {
    name: "Joao o ADM",
    email: "joao.adm@email.com",
    password:password,
    birthDate:dataValue,
    CPF:"23793838048",
    addressId:4,
    phone:"45920193948",
    accessLevel:accessLevel as AccessLevel,
    storeId:1
    
  };
  return employeeAdm;
}

export const createFuncEmployee = async()=>{
  const dataValue = new Date("1995-12-27");
  const password = await hashPassword();
  const accessLevel = "FUNCIONARIO";

  const employeeFunc = {
    name: "Matheus o Func",
    email: "matheus.func@email.com",
    password:password,
    birthDate:dataValue,
    CPF:"23793838048",
    addressId:4,
    phone:"45920193948",
    accessLevel:accessLevel as AccessLevel,
    storeId:1
    
  };
  return employeeFunc;
}