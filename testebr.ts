import { fakerBr } from "@js-brasil/fakerbr";
import {fakerPT_BR as faker} from "@faker-js/faker"
import {Factory} from "./src/__tests__/factory"

// console.log(fakerBr.endereco())

// console.log(faker.location.street());

// console.log(faker.location.country());

// console.log(faker.finance.creditCardNumber());
// console.log(faker.finance.iban());
// console.log(faker.finance.transactionType());

const factory = new Factory();

console.log(factory.employeeFactory());


