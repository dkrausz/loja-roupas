import { log } from "node:console";
import fs from "node:fs/promises";
import {Builder} from "xml2js";


type Tuser={  
  email:string,
  password:string
}



const user:Tuser ={
  email: "danilo.krausz@email.com",
  password: "senha123"
}


const userList:Tuser[] = [];

userList.push(user);
userList.push(user);

const convertToCsv = (list:Tuser[])=>{

  const csvArray = [
    ["email", "password"],
    ...list.map(item=>[item.email,item.password])
   ].map(e => e.join(",")) 
   .join("\n");

   console.log(csvArray);
   
   return csvArray;
}

const csvUserList=convertToCsv(userList);
fs.writeFile('data.csv', csvUserList);