import supertest from "supertest";
import { app } from "../../../app";
import { Factory } from "../../factory";
import { prisma } from "../../../database/prisma";
import { sign } from "jsonwebtoken";
import { jwtConfig } from "../../../configs/auth.config";
import { address1, createAdmEmployee, createFuncEmployee } from "../../utils/Employee.mock";
import { any } from "zod";


describe("Product test",()=>{

const request = supertest(app);
const factory = new Factory();

  beforeEach(async()=>{
    await prisma.product.deleteMany();
    await prisma.employee.deleteMany();
  });

test("Should be able to create a new product as an ADM",async()=>{
  const employeeAddress= await prisma.address.create({data:address1});
  const employeeADM = await createAdmEmployee();
  employeeADM.addressId=employeeAddress.id;
  const createdAdm = await prisma.employee.create({data:employeeADM});
  const { jwtKey, expiresIn } = jwtConfig();

  const token: string = sign({ accessLevel: createdAdm.accessLevel }, jwtKey, {
    expiresIn: expiresIn,
    subject: createdAdm.publicId,
  });

  const newProduct = factory.productFactory();

  const expectedBody = {
    publicId: expect.any(String),
    name:newProduct.name,
    description:newProduct.description,
    price:newProduct.price,
    
  };
  

const response = await request.post("/products").send(newProduct).set("Authorization" ,`Bearer ${token}`);


expect(response.body).toEqual(expectedBody);
expect(response.statusCode).toBe(201);

});

test("Should be able to create a new product as an Employee",async()=>{
  const employeeAddress= await prisma.address.create({data:address1});
  const employee = await createFuncEmployee();
  employee.addressId=employeeAddress.id;
  const createdAdm = await prisma.employee.create({data:employee});
  const { jwtKey, expiresIn } = jwtConfig();

  const token: string = sign({ accessLevel: createdAdm.accessLevel }, jwtKey, {
    expiresIn: expiresIn,
    subject: createdAdm.publicId,
  });

  const newProduct = factory.productFactory();

  const expectedBody = {
    publicId: expect.any(String),
    name:newProduct.name,
    description:newProduct.description,
    price:newProduct.price,
    
  };
  

const response = await request.post("/products").send(newProduct).set("Authorization" ,`Bearer ${token}`);


expect(response.body).toEqual(expectedBody);
expect(response.statusCode).toBe(201);

});

test("Should return an error if there is no token",async()=>{  

const newProduct = factory.productFactory();

const response = await request.post("/products").send(newProduct);

expect(response.statusCode).toBe(401);

});

test("Should return an error if use a expired token",async()=>{

  const newProduct = factory.productFactory();
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NMZXZlbCI6IkFETSIsImlhdCI6MTcyMjg5MjU3MywiZXhwIjoxNzIyOTc4OTczLCJzdWIiOiI3ZTEzZmZmYS1kNGNhLTQ1NWUtYmRlNy1mNGZkMmM5ODUxNzQifQ.R3iiMXdt2ismPHn0SmQH4Builq_N99eqNKJUp7lG6Ug";
  const response = await request.post("/employee").send(newProduct).set("Authorization", `Bearer ${token}`);

 expect(response.statusCode).toBe(401);

});


test("Should be able to get all the products", async ()=>{
  
  const employeeAddress= await prisma.address.create({data:address1});
  const employee = await createFuncEmployee();
  employee.addressId=employeeAddress.id;
  const createdAdm = await prisma.employee.create({data:employee});
  const { jwtKey, expiresIn } = jwtConfig();
  
  const product1 = factory.productFactory();
  const product2 = factory.productFactory();
  const product3 = factory.productFactory();
  const createdProduct1 = await prisma.product.create({data:product1});
  const createdProduct2 = await prisma.product.create({data:product2});
  const createdProduct3 = await prisma.product.create({data:product3});
  
const response = await request.get("/products");

expect(response.body.data).toHaveLength(3);
expect(response.statusCode).toBe(200);
  
});

test("Should be able to get an item by id", async ()=>{
  
  const employeeAddress= await prisma.address.create({data:address1});
  const employee = await createFuncEmployee();
  employee.addressId=employeeAddress.id;
  const createdAdm = await prisma.employee.create({data:employee});
  const { jwtKey, expiresIn } = jwtConfig();
  
  const product1 = factory.productFactory();
  const product2 = factory.productFactory();
  const product3 = factory.productFactory();
  const createdProduct1 = await prisma.product.create({data:product1});
  const createdProduct2 = await prisma.product.create({data:product2});
  const createdProduct3 = await prisma.product.create({data:product3});

  const {publicId} = createdProduct1;

  const expectedBody = {
    publicId: publicId,
    name:createdProduct1.name,
    description:createdProduct1.description,
    price:createdProduct1.price,
    
  };
  
const response = await request.get(`/products/${publicId}`);

expect(response.body).toEqual(expectedBody)
expect(response.statusCode).toBe(200);
  
});
  
test("Should return an error if id does not exist", async ()=>{
  
  const employeeAddress= await prisma.address.create({data:address1});
  const employee = await createFuncEmployee();
  employee.addressId=employeeAddress.id;
  const createdAdm = await prisma.employee.create({data:employee});
  const { jwtKey, expiresIn } = jwtConfig();
  
  const product1 = factory.productFactory();
  const product2 = factory.productFactory();
  const product3 = factory.productFactory();
  const createdProduct1 = await prisma.product.create({data:product1});
  const createdProduct2 = await prisma.product.create({data:product2});
  const createdProduct3 = await prisma.product.create({data:product3});

  const publicId = "0a55be66-6c55-4459-9864-6907489102b1";


const response = await request.get(`/products/${publicId}`);


expect(response.statusCode).toBe(404);
  
});
    
test("Should be able to update a product as an ADM", async ()=>{
  
  const employeeAddress= await prisma.address.create({data:address1});
  const employeeADM = await createAdmEmployee();
  employeeADM.addressId=employeeAddress.id;
  const createdAdm = await prisma.employee.create({data:employeeADM});
  const { jwtKey, expiresIn } = jwtConfig();

  const token: string = sign({ accessLevel: createdAdm.accessLevel }, jwtKey, {
    expiresIn: expiresIn,
    subject: createdAdm.publicId,
  });

  const newProduct = factory.productFactory();
  const createdProduct = await prisma.product.create({data:newProduct});
  const {publicId} = createdProduct;
  
  const newPrice ={
  price: 999
  } ; 

  const expectedBody = {
    publicId: expect.any(String),
    name:newProduct.name,
    description:newProduct.description,
    price:newPrice.price,
    
  };
  

const response = await request.patch(`/products/${publicId}`).send(newPrice).set("Authorization" ,`Bearer ${token}`);



expect(response.body).toEqual(expectedBody);
expect(response.statusCode).toBe(200);

  
});  

test("Should be able to update a product as an Employee", async ()=>{
  
  const employeeAddress= await prisma.address.create({data:address1});
  const employee = await createFuncEmployee();
  employee.addressId=employeeAddress.id;
  const createdAdm = await prisma.employee.create({data:employee});
  const { jwtKey, expiresIn } = jwtConfig();

  const token: string = sign({ accessLevel: createdAdm.accessLevel }, jwtKey, {
    expiresIn: expiresIn,
    subject: createdAdm.publicId,
  });

  const newProduct = factory.productFactory();
  const createdProduct = await prisma.product.create({data:newProduct});
  const {publicId} = createdProduct;
  
  const newPrice ={
  price: 999
  } ; 

  const expectedBody = {
    publicId: expect.any(String),
    name:newProduct.name,
    description:newProduct.description,
    price:newPrice.price,
    
  };
  

const response = await request.patch(`/products/${publicId}`).send(newPrice).set("Authorization" ,`Bearer ${token}`);



expect(response.body).toEqual(expectedBody);
expect(response.statusCode).toBe(200);

  
});  

test("Should return an error if id does not exist", async ()=>{
  
  const employeeAddress= await prisma.address.create({data:address1});
  const employeeADM = await createAdmEmployee();
  employeeADM.addressId=employeeAddress.id;
  const createdAdm = await prisma.employee.create({data:employeeADM});
  const { jwtKey, expiresIn } = jwtConfig();

  const token: string = sign({ accessLevel: createdAdm.accessLevel }, jwtKey, {
    expiresIn: expiresIn,
    subject: createdAdm.publicId,
  });

  const newProduct = factory.productFactory();
  const createdProduct = await prisma.product.create({data:newProduct});
  const {publicId} = createdProduct;
  
  const newPrice ={
  price: 999
  } ; 

  const expectedBody = {
    publicId: expect.any(String),
    name:newProduct.name,
    description:newProduct.description,
    price:newPrice.price,
    
  };
  

const response = await request.patch(`/products/7fd99417-683c-43f4-a1d9-f4c82faa90ae`).send(newPrice).set("Authorization" ,`Bearer ${token}`);

expect(response.statusCode).toBe(404);

  
});  

test("Should be able to delete a protucs as an ADM", async ()=>{
  
  const employeeAddress= await prisma.address.create({data:address1});
  const employeeADM = await createAdmEmployee();
  employeeADM.addressId=employeeAddress.id;
  const createdAdm = await prisma.employee.create({data:employeeADM});
  const { jwtKey, expiresIn } = jwtConfig();

  const token: string = sign({ accessLevel: createdAdm.accessLevel }, jwtKey, {
    expiresIn: expiresIn,
    subject: createdAdm.publicId,
  });

  const newProduct = factory.productFactory();
  const createdProduct = await prisma.product.create({data:newProduct});
  const {publicId} = createdProduct;

  
const response = await request.delete(`/products/${publicId}`).set("Authorization" ,`Bearer ${token}`);

expect(response.statusCode).toBe(204);

  
});  

test("Should return an error if you not an ADM", async ()=>{
  
  const employeeAddress= await prisma.address.create({data:address1});
  const employee = await createFuncEmployee();
  employee.addressId=employeeAddress.id;
  const createdAdm = await prisma.employee.create({data:employee});
  const { jwtKey, expiresIn } = jwtConfig();

  const token: string = sign({ accessLevel: createdAdm.accessLevel }, jwtKey, {
    expiresIn: expiresIn,
    subject: createdAdm.publicId,
  });

  const newProduct = factory.productFactory();
  const createdProduct = await prisma.product.create({data:newProduct});
  const {publicId} = createdProduct;

  
const response = await request.delete(`/products/${publicId}`).set("Authorization" ,`Bearer ${token}`);

expect(response.statusCode).toBe(403);

  
}); 

test("Should return an error if id does not exist", async ()=>{
  
  const employeeAddress= await prisma.address.create({data:address1});
  const employeeADM = await createAdmEmployee();
  employeeADM.addressId=employeeAddress.id;
  const createdAdm = await prisma.employee.create({data:employeeADM});
  const { jwtKey, expiresIn } = jwtConfig();

  const token: string = sign({ accessLevel: createdAdm.accessLevel }, jwtKey, {
    expiresIn: expiresIn,
    subject: createdAdm.publicId,
  });

  const newProduct = factory.productFactory();
  const createdProduct = await prisma.product.create({data:newProduct});
  const {publicId} = createdProduct;

  
const response = await request.delete(`/products/7fd99417-683c-43f4-a1d9-f4c82faa90ae`).set("Authorization" ,`Bearer ${token}`);

expect(response.statusCode).toBe(404);

  
}); 

test("Should return an error if there is no token", async ()=>{
  
  const employeeAddress= await prisma.address.create({data:address1});
  const employee = await createFuncEmployee();
  employee.addressId=employeeAddress.id;
  const createdAdm = await prisma.employee.create({data:employee});
  const { jwtKey, expiresIn } = jwtConfig();

  const token: string = sign({ accessLevel: createdAdm.accessLevel }, jwtKey, {
    expiresIn: expiresIn,
    subject: createdAdm.publicId,
  });

  const newProduct = factory.productFactory();
  const createdProduct = await prisma.product.create({data:newProduct});
  const {publicId} = createdProduct;

  
const response = await request.delete(`/products/${publicId}`);

expect(response.statusCode).toBe(401);

  
});


//adm pode deletar ok

//funci pode deletar ok
// sem token nao deleta
//token invalido nao deleta



});