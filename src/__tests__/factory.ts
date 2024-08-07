import { fakerBr } from "@js-brasil/fakerbr";
import {fakerPT_BR as faker} from "@faker-js/faker"
import { TClient, TClientRegister } from "../client/interfaces";
import { TCreateProductBody } from "../products/interfaces";

export class Factory{

  public clientFactory=():TClientRegister=>{
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const nome = firstName + " " +lastName;    
    const password= 'Teste123*';
    const CPF = fakerBr.cpf().replaceAll('.','').replaceAll('-','');
    const phone = fakerBr.telefone().replaceAll(/[()\-\- ]/g,'');
    const birthDate = faker.date.birthdate({min:1900,max:2005,mode:"year" });
        
    const newClient = {
      name: nome,
      email:faker.internet.email({firstName,lastName}),
      password:password,
      birthDate:birthDate,
      CPF: CPF,
      phone:phone,
      storeId:1 
    
    };

    return newClient;
  };

  public productFactory = ():TCreateProductBody=>{
    const name = faker.commerce.product();
    const description = faker.commerce.productDescription();
    const price = Number(faker.commerce.price({min:10,max:500}));

    const newProduct={
      name,
      description,
      price
    }

    return newProduct;

  }


  private convertDate=(dateString: string)=>{
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        throw new Error("Data inválida");
    }
  
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();
  
    const formattedDay = day.toString().padStart(2, '0');
    const formattedMonth = month.toString().padStart(2, '0');
   
    // return `${formattedDay}/${formattedMonth}/${year}`;
  }
}