import {fakerPT_BR as faker} from "@faker-js/faker";
import {Factory} from "./src/__tests__/factory"
import supertest from "supertest";
import {app} from "./src/app"

const factory = new Factory();

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NMZXZlbCI6IkFETSIsImlhdCI6MTcyMjg5MjU3MywiZXhwIjoxNzIyOTc4OTczLCJzdWIiOiI3ZTEzZmZmYS1kNGNhLTQ1NWUtYmRlNy1mNGZkMmM5ODUxNzQifQ.R3iiMXdt2ismPHn0SmQH4Builq_N99eqNKJUp7lG6Ug";
const request = supertest(app);
const addProduct = async()=>{
  const newProduct = factory.productFactory();
  
  const response = await request.post("/products").send(newProduct).set("Authorization",`Bearer ${token}`);
  
}
for(let i =0;i<100;i++){
  addProduct();

}