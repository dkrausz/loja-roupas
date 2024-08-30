import supertest from "supertest";
import { app, loadedStore } from "../../app";
import { Factory } from "../utils/factory";
import { prisma } from "../../database/prisma";
import { createAdmEmployee, address1,address2,createFuncEmployee,store } from "../utils/Employee.mock";
import {jwtConfig} from "../../configs/auth.config";
import { sign } from "jsonwebtoken";
import { initStore } from "../../configs/initStore.config";


describe("Employee test",()=>{
  const request = supertest(app);
  const factory = new Factory();

  beforeAll(async()=>{   
    await prisma.employee.deleteMany();
    await prisma.product.deleteMany();
    await prisma.order.deleteMany();
    await prisma.client.deleteMany();   
    await prisma.store.deleteMany();
    await prisma.address.deleteMany();

    const addressStore = address2;
    const newStore = store;
    const createdStoreAddress= await prisma.address.create({data:addressStore});
    newStore.addressId=createdStoreAddress.id;
    const createdStore = await prisma.store.create({data:newStore});
    await initStore(loadedStore);
  });

  beforeEach( async()=>{   
    
    await prisma.employee.deleteMany();
    await prisma.product.deleteMany();
    await prisma.order.deleteMany();
    await prisma.client.deleteMany();   
           
  });

  afterAll( async()=>{
    await prisma.employee.deleteMany();
    await prisma.product.deleteMany();
    await prisma.order.deleteMany();
    await prisma.client.deleteMany();
    await prisma.store.deleteMany();
    await prisma.address.deleteMany();
   
  });


test("Should be able to create a new employee",async ()=>{

  const employeeAddress= await prisma.address.create({data:address1});
  const employeeADM = await createAdmEmployee();
  employeeADM.addressId=employeeAddress.id;
  employeeADM.storeId= loadedStore.id;
  
  const createdAdm = await prisma.employee.create({data:employeeADM});

  const { jwtKey, expiresIn } = jwtConfig();
  const token: string = sign({ accessLevel: createdAdm.accessLevel }, jwtKey, {
    expiresIn: expiresIn,
    subject: createdAdm.publicId,
  });
 

  const newEmployee = factory.employeeFactory();
  
  const response = await request.post("/employee").send(newEmployee).set("Authorization", `Bearer ${token}`);

  const expectedResponseBody = {   
    publicId:expect.any(String),
    name:newEmployee.name,
    email:newEmployee.email,
    birthDate:newEmployee.birthDate.toISOString(),
    CPF:newEmployee.CPF,    
    phone:newEmployee.phone,
    accessLevel:newEmployee.accessLevel,   
    address:{
      street:newEmployee.address.street,
      number:newEmployee.address.number,
      complement: newEmployee.address.complement,
      zipCode:newEmployee.address.zipCode,
      neighborhood:newEmployee.address.neighborhood,
      state:newEmployee.address.state,
      city:newEmployee.address.city,
      country:newEmployee.address.country
    }	,

    store: {
      publicId: expect.any(String),
      name: expect.any(String),
      CNPJ: expect.any(String),
    }
  };
  
  expect(response.body).toEqual(expectedResponseBody);
  expect(response.statusCode).toBe(201);


});

test("Should return a error if dont use required keys",async ()=>{

  const employeeAddress= await prisma.address.create({data:address1});
  const employeeADM = await createAdmEmployee();
  employeeADM.addressId=employeeAddress.id;
  employeeADM.storeId=loadedStore.id;

  const createdAdm = await prisma.employee.create({data:employeeADM});
  const { jwtKey, expiresIn } = jwtConfig();

  const token: string = sign({ accessLevel: createdAdm.accessLevel }, jwtKey, {
    expiresIn: expiresIn,
    subject: createdAdm.publicId,
  });
 
  const newEmployee = factory.employeeFactory();

  const {name, ...employeeWithoutKeys} = newEmployee;

  const response = await request.post("/employee").send(employeeWithoutKeys).set("Authorization", `Bearer ${token}`);

  const expectedResponseBody = {   
    publicId:expect.any(String),
    name:newEmployee.name,
    email:newEmployee.email,
    birthDate:newEmployee.birthDate.toISOString(),
    CPF:newEmployee.CPF,    
    phone:newEmployee.phone,
    accessLevel:newEmployee.accessLevel,   
    address:{
      street:newEmployee.address.street,
      number:newEmployee.address.number,
      complement: newEmployee.address.complement,
      zipCode:newEmployee.address.zipCode,
      neighborhood:newEmployee.address.neighborhood,
      state:newEmployee.address.state,
      city:newEmployee.address.city,
      country:newEmployee.address.country
    }	,

    store: {
      publicId: expect.any(String),
      name: expect.any(String),
      CNPJ: expect.any(String),
    }
  };
  
  expect(response.statusCode).toBe(400);

});

test("Should return an error if there is no token",async()=>{

  const newEmployee = factory.employeeFactory();
  const response = await request.post("/employee").send(newEmployee);

 expect(response.statusCode).toBe(401);

});

test("Should return an error if use a expired token",async()=>{

  const newEmployee = factory.employeeFactory();
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NMZXZlbCI6IkFETSIsImlhdCI6MTcyMjg5MjU3MywiZXhwIjoxNzIyOTc4OTczLCJzdWIiOiI3ZTEzZmZmYS1kNGNhLTQ1NWUtYmRlNy1mNGZkMmM5ODUxNzQifQ.R3iiMXdt2ismPHn0SmQH4Builq_N99eqNKJUp7lG6Ug";
  const response = await request.post("/employee").send(newEmployee).set("Authorization", `Bearer ${token}`);

 expect(response.statusCode).toBe(401);

});

test("Should return an error if dont use an ADM token",async ()=>{  


  const employeeAddress= await prisma.address.create({data:address2});
  const employeeFunc = await createFuncEmployee();
  employeeFunc.addressId=employeeAddress.id;
  employeeFunc.storeId=loadedStore.id;

  const createFunc = await prisma.employee.create({data:employeeFunc});
  const { jwtKey, expiresIn } = jwtConfig();

  const token: string = sign({ accessLevel: createFunc.accessLevel }, jwtKey, {
    expiresIn: expiresIn,
    subject: createFunc.publicId,
  });
    

  const newEmployee = factory.employeeFactory();
  const response = await request.post("/employee").send(newEmployee).set("Authorization", `Bearer ${token}`);
  
  expect(response.statusCode).toBe(403);


});

test("Should be able to get all the employees as a ADM",async ()=>{

  const employeeAddress= await prisma.address.create({data:address1});
  const employeeADM = await createAdmEmployee();
  employeeADM.addressId=employeeAddress.id;
  employeeADM.storeId=loadedStore.id;
  const createdAdm = await prisma.employee.create({data:employeeADM});
  const { jwtKey, expiresIn } = jwtConfig();

  const token: string = sign({ accessLevel: createdAdm.accessLevel }, jwtKey, {
    expiresIn: expiresIn,
    subject: createdAdm.publicId,
  });
 
  const newEmployee = factory.employeeFactory();
  const newEmployee2 = factory.employeeFactory();  
  

  const {address , ...employeeWithouAdress1} = newEmployee;
  const {address:address3 , ...employeeWithouAdress2} = newEmployee2;  

  const employee1Address= await prisma.address.create({data:address});
  const employee2Address= await prisma.address.create({data:address3});

  employeeWithouAdress1.addressId = employee1Address.id; 
  employeeWithouAdress2.addressId = employee2Address.id;

  const filteredNewEmployee1 ={...employeeWithouAdress1, storeId:loadedStore.id};
  const filteredNewEmployee2 ={...employeeWithouAdress2, storeId:loadedStore.id};


  const createdEmployee = await prisma.employee.create({data:filteredNewEmployee1});
  const createdEmployee2 = await prisma.employee.create({data:filteredNewEmployee2});

  const response = await request.get("/employee").set("Authorization", `Bearer ${token}`)

  expect(response.body).toHaveLength(3)  
  expect(response.statusCode).toBe(200);


});

test("Should return an error if there is no token",async()=>{

  const newEmployee = factory.employeeFactory();
 
  const response = await request.get("/employee");

 expect(response.statusCode).toBe(401);

});

test("Should return an error if dont use an ADM token",async ()=>{
  
  const employeeAddress= await prisma.address.create({data:address2});
  const employeeFunc = await createFuncEmployee();
  employeeFunc.addressId=employeeAddress.id;
  employeeFunc.storeId=loadedStore.id;

  const createFunc = await prisma.employee.create({data:employeeFunc});
  const { jwtKey, expiresIn } = jwtConfig();

  const token: string = sign({ accessLevel: createFunc.accessLevel }, jwtKey, {
    expiresIn: expiresIn,
    subject: createFunc.publicId,
  });

  const response = await request.get("/employee").set("Authorization", `Bearer ${token}`);
  
  expect(response.statusCode).toBe(403);

});

test("Should be able to update your own information",async ()=>{
  
  const employeeAddress= await prisma.address.create({data:address2});
  const employeeFunc = await createFuncEmployee();
  employeeFunc.addressId=employeeAddress.id;
  employeeFunc.storeId = loadedStore.id;

  const createFunc = await prisma.employee.create({data:employeeFunc});
  const { jwtKey, expiresIn } = jwtConfig();

  const token: string = sign({ accessLevel: createFunc.accessLevel }, jwtKey, {
    expiresIn: expiresIn,
    subject: createFunc.publicId,
  });

  const {publicId} = createFunc;

  const data = {
    name: "jao do caminhao"
  }

  const response = await request.patch(`/employee/${publicId}`).set("Authorization", `Bearer ${token}`).send(data);

  expect(response.body.name).toEqual(data.name);
  expect(response.statusCode).toBe(200);

});

test("Should be able to update other information as an ADM",async ()=>{  

  const employeeAddress= await prisma.address.create({data:address1});
  const employeeADM = await createAdmEmployee();
  employeeADM.addressId=employeeAddress.id;
  employeeADM.storeId=loadedStore.id;

  const createdAdm = await prisma.employee.create({data:employeeADM});
  const { jwtKey, expiresIn } = jwtConfig();

  const token: string = sign({ accessLevel: createdAdm.accessLevel }, jwtKey, {
    expiresIn: expiresIn,
    subject: createdAdm.publicId,
  });
  
  const employeeAddress2= await prisma.address.create({data:address2});
  const employeeFunc = await createFuncEmployee();
  employeeFunc.addressId=employeeAddress2.id;
  employeeFunc.storeId=loadedStore.id;

  const createFunc = await prisma.employee.create({data:employeeFunc});

  const {publicId} = createFunc;

  const data = {
    name: "jao do caminhao"
  }

  const response = await request.patch(`/employee/${publicId}`).set("Authorization", `Bearer ${token}`).send(data);

  expect(response.body.name).toEqual(data.name);
  expect(response.statusCode).toBe(200);

});

test("Should return an error if there is no token",async ()=>{
  
  const employeeAddress= await prisma.address.create({data:address2});
  const employeeFunc = await createFuncEmployee();
  employeeFunc.addressId=employeeAddress.id;
  employeeFunc.storeId=loadedStore.id;

  const createFunc = await prisma.employee.create({data:employeeFunc});

  const {publicId} = createFunc;

  const data = {
    name: "jao do caminhao"
  }

  const response = await request.patch(`/employee/${publicId}`).send(data);

  
  expect(response.statusCode).toBe(401);
});

test("Should return a error if a employee tries to update other employee",async ()=>{
 
  const employee1 = await createFuncEmployee();
  const employee2 = factory.employeeFactory();

  employee1.storeId=loadedStore.id;
  
  const address = address1;
  const {address:address2,...filteredEmployee2} = employee2;
  
  const employee1Address = await prisma.address.create({data:address});
  const employee2Address = await prisma.address.create({data:address2});

  employee1.addressId=employee1Address.id;
  filteredEmployee2.addressId=employee2Address.id;
  const newEmployee2 = {storeId:loadedStore.id, ...filteredEmployee2};

  const createdEmployee = await prisma.employee.create({data:employee1});
  const createdEmployee2 = await prisma.employee.create({data:newEmployee2});

  const { jwtKey, expiresIn } = jwtConfig();

  const token: string = sign({ accessLevel: createdEmployee.accessLevel }, jwtKey, {
    expiresIn: expiresIn,
    subject: createdEmployee.publicId,
  });
  

  const {publicId} = createdEmployee2;

  const data = {
    name: "jao do caminhao"
  }

  const response = await request.patch(`/employee/${publicId}`).set("Authorization", `Bearer ${token}`).send(data);

  expect(response.statusCode).toBe(403);

});

test("Should be able to delete an employee as an ADM",async ()=>{
    
  const employee1 = await createAdmEmployee();
  const employee2 = factory.employeeFactory();
  
  employee1.storeId=loadedStore.id;
 
  const address =address1;
  const {address:address2,...filteredEmployee2} = employee2;

  const employee1Address = await prisma.address.create({data:address});
  employee1.addressId=employee1Address.id

  const employee2Address = await prisma.address.create({data:address2});

  const newEmployee2 ={storeId:loadedStore.id,...filteredEmployee2};

  const createdEmployee = await prisma.employee.create({data:employee1});
  const createdEmployee2 = await prisma.employee.create({data:newEmployee2});


  const { jwtKey, expiresIn } = jwtConfig();

  const token: string = sign({ accessLevel: createdEmployee.accessLevel }, jwtKey, {
    expiresIn: expiresIn,
    subject: createdEmployee.publicId,
  });
  
  const {publicId} = createdEmployee2;

  const response = await request.delete(`/employee/${publicId}`).set("Authorization", `Bearer ${token}`);
  
  expect(response.statusCode).toBe(204);

});

test("Should return a error if a employee tries to delete other employee",async ()=>{
 
  const employee1 = await createFuncEmployee();
  const employee2 = factory.employeeFactory();

  employee1.storeId=loadedStore.id;
   
  const address =address1;
  const {address:address2,...filteredEmployee2} = employee2;

  const employee1Address = await prisma.address.create({data:address});
  employee1.addressId=employee1Address.id

  const employee2Address = await prisma.address.create({data:address2});

  const newEmployee2 = {storeId:loadedStore.id,...filteredEmployee2};

  const createdEmployee = await prisma.employee.create({data:employee1});
  const createdEmployee2 = await prisma.employee.create({data:newEmployee2});


  const { jwtKey, expiresIn } = jwtConfig();

  const token: string = sign({ accessLevel: createdEmployee.accessLevel }, jwtKey, {
    expiresIn: expiresIn,
    subject: createdEmployee.publicId,
  });
  
  const {publicId} = createdEmployee2;

  const response = await request.delete(`/employee/${publicId}`).set("Authorization", `Bearer ${token}`);
  
  expect(response.statusCode).toBe(403);

});

// test("Should be able to Login as an ADM",async ()=>{

//   const addressStore = address2;
//   const newStore = store;
//   const createdStoreAddress= await prisma.address.create({data:addressStore});
//   newStore.addressId=createdStoreAddress.id;
//   const createdStore = await prisma.store.create({data:newStore});

//   const employeeAddress= await prisma.address.create({data:address1});
//   const employeeADM = await createAdmEmployee();
//   employeeADM.addressId=employeeAddress.id;
//   employeeADM.storeId = createdStore.id;
//   const createdAdm = await prisma.employee.create({data:employeeADM});
 
// const loginData = {
//   email:employeeADM.email,
//   password: "Teste123*"
// };
    
//   const response = await request.post("/employee/login").send(loginData);

//   const expectedResponseBody = {   
//     token:expect.any(String),
//     employee:{
//       publicId:createdAdm.publicId,
//       name:createdAdm.name,
//       email:createdAdm.email,
//       birthDate: createdAdm.birthDate.toISOString(),
// 		  CPF: createdAdm.CPF,
// 		  phone: createdAdm.phone,
// 		  accessLevel: createdAdm.accessLevel
//     }
    
//   };
      
//   expect(response.body).toEqual(expectedResponseBody);
//   expect(response.statusCode).toBe(200);

// });

// test("Should be able to Login as an Employee",async ()=>{

//   const addressStore = address2;
//   const newStore = store;
//   const createdStoreAddress= await prisma.address.create({data:addressStore});
//   newStore.addressId=createdStoreAddress.id;
//   const createdStore = await prisma.store.create({data:newStore});

//   const employeeAddress= await prisma.address.create({data:address1});
//   const employee = await createFuncEmployee();
//   employee.addressId=employeeAddress.id;
//   employee.storeId=createdStore.id;
//   const createdEmployee = await prisma.employee.create({data:employee});
 
// const loginData = {
//   email:employee.email,
//   password: "Teste123*"
// };
    
//   const response = await request.post("/employee/login").send(loginData);

//   const expectedResponseBody = {   
//     token:expect.any(String),
//     employee:{
//       publicId:createdEmployee.publicId,
//       name:createdEmployee.name,
//       email:createdEmployee.email,
//       birthDate: createdEmployee.birthDate.toISOString(),
// 		  CPF: createdEmployee.CPF,
// 		  phone: createdEmployee.phone,
// 		  accessLevel: createdEmployee.accessLevel
//     }
    
//   };
      
//   expect(response.body).toEqual(expectedResponseBody);
//   expect(response.statusCode).toBe(200);

// });

// test("Should return an error if try to login with a wrong email",async ()=>{

//   const addressStore = address2;
//   const newStore = store;
//   const createdStoreAddress= await prisma.address.create({data:addressStore});
//   newStore.addressId=createdStoreAddress.id;
//   const createdStore = await prisma.store.create({data:newStore});

//   const employeeAddress= await prisma.address.create({data:address1});
//   const employee = await createFuncEmployee();
//   employee.addressId=employeeAddress.id;
//   employee.storeId = createdStore.id;
//   const createdEmployee = await prisma.employee.create({data:employee});
 
// const loginData = {
//   email:"email.errado@gmail.com",
//   password: "Teste123*"
// };
    
//   const response = await request.post("/employee/login").send(loginData);
  
      
//   expect(response.statusCode).toBe(401);

// });

// test("Should return an error if try to login with a wrong password",async ()=>{

//   const addressStore = address2;
//   const newStore = store;
//   const createdStoreAddress= await prisma.address.create({data:addressStore});
//   newStore.addressId=createdStoreAddress.id;
//   const createdStore = await prisma.store.create({data:newStore});

//   const employeeAddress= await prisma.address.create({data:address1});
//   const employee = await createFuncEmployee();
//   employee.storeId=createdStore.id;
//   employee.addressId=employeeAddress.id;
//   const createdEmployee = await prisma.employee.create({data:employee});
 
// const loginData = {
//   email:createdEmployee.email,
//   password: "SenhaErrada1*"
// };
    
//   const response = await request.post("/employee/login").send(loginData);
  
      
//   expect(response.statusCode).toBe(401);

// });

});