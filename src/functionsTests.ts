import { fakerBr } from "@js-brasil/fakerbr";
import { fakerPT_BR } from "@faker-js/faker";
import { faker, pt_BR } from "@faker-js/faker";

// const client = faker.person.fullName();
// console.log("Nome:", client);

// const street = faker.location.streetAddress(true);
// console.log(street);

// const end = fakerBr.endereco();
// console.log(end.logradouro);
// // const cpf = fakerBr.cpf().replaceAll('.','').replaceAll('-','');;
// console.log("CPF: ", cpf);

// const dataValida = String(
//   faker.date.birthdate({ min: 18, max: 90, mode: "age" })
// );
// console.log("Data gerada: ", dataValida);
// console.log("Tipo da data: ", typeof dataValida);
// const strToDate = new Date(dataValida);
// console.log(strToDate);
// console.log(typeof strToDate);
// console.log("CNPJ: ", fakerBr.cnpj());
// console.log("Nome de loja: ", faker.company.name());
const max = 5;
const min = 0;
const num = Math.floor(Math.random() * (max - min + 1)) + min;
console.log(num);
