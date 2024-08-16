import supertest from "supertest";
import { app } from "../../../app";
import { Factory } from "../../factory";
import { prisma } from "../../../database/prisma";
import { createAdmEmployee, address1,address2,createFuncEmployee } from "../../utils/Employee.mock";
import {jwtConfig} from "../../../configs/auth.config";
import { sign } from "jsonwebtoken";


describe("Employee test",()=>{
  const request = supertest(app);
  const factory = new Factory();

  beforeEach( async()=>{
    await prisma.employee.deleteMany();
    
  });


test("Should be able to create a new employee",async ()=>{

  const employeeAddress= await prisma.address.create({data:address1});
  const employeeADM = await createAdmEmployee();
  employeeADM.addressId=employeeAddress.id;
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
      publicId: '4b87e500-240b-4df5-8cf1-752660306f9c',
      name: 'loja do zé',
      CNPJ: '1234567800200'
    }
  };
  
  expect(response.body).toEqual(expectedResponseBody);
  expect(response.statusCode).toBe(201);


});

test("Should return a error if dont use required keys",async ()=>{

  const employeeAddress= await prisma.address.create({data:address1});
  const employeeADM = await createAdmEmployee();
  employeeADM.addressId=employeeAddress.id;
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
      publicId: '4b87e500-240b-4df5-8cf1-752660306f9c',
      name: 'loja do zé',
      CNPJ: '1234567800200'
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
  const createdAdm = await prisma.employee.create({data:employeeADM});
  const { jwtKey, expiresIn } = jwtConfig();

  const token: string = sign({ accessLevel: createdAdm.accessLevel }, jwtKey, {
    expiresIn: expiresIn,
    subject: createdAdm.publicId,
  });
 
  const newEmployee = factory.employeeFactory();
  const newEmployee2 = factory.employeeFactory();  

  const {address , ...filteredNewEmployee} = newEmployee;
  const {address:address2 , ...filteredNewEmployee2} = newEmployee2;

  const employee1Address= await prisma.address.create({data:address});
  const employee2Address= await prisma.address.create({data:address2});

  filteredNewEmployee.addressId = employee1Address.id;
  filteredNewEmployee2.addressId = employee2Address.id;

  const createdEmployee = await prisma.employee.create({data:filteredNewEmployee});
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
  const createdAdm = await prisma.employee.create({data:employeeADM});
  const { jwtKey, expiresIn } = jwtConfig();

  const token: string = sign({ accessLevel: createdAdm.accessLevel }, jwtKey, {
    expiresIn: expiresIn,
    subject: createdAdm.publicId,
  });
  
  const employeeAddress2= await prisma.address.create({data:address2});
  const employeeFunc = await createFuncEmployee();
  employeeFunc.addressId=employeeAddress2.id;
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

  const response = await request.patch(`/employee/${publicId}`).send(data);

  
  expect(response.statusCode).toBe(401);
});

test("Should return a error if a employee tries to update other employee",async ()=>{

 
  const employee1 = await createFuncEmployee();
  const employee2 = factory.employeeFactory();
  
  const address = address1;
  const {address:address2,...filteredEmployee2} = employee2;
  
  const employee1Address = await prisma.address.create({data:address});
  const employee2Address = await prisma.address.create({data:address2});

  employee1.addressId=employee1Address.id;
  filteredEmployee2.addressId=employee2Address.id;

  const createdEmployee = await prisma.employee.create({data:employee1});
  const createdEmployee2 = await prisma.employee.create({data:filteredEmployee2});


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

test("Should be able to delete an employee been an ADM",async ()=>{

  
  const employee1 = await createAdmEmployee();
  const employee2 = factory.employeeFactory();
  
  const address =address1;
  const {address:address2,...filteredEmployee2} = employee2;

  const employee1Address = await prisma.address.create({data:address});
  employee1.addressId=employee1Address.id

  const employee2Address = await prisma.address.create({data:address2});

  const createdEmployee = await prisma.employee.create({data:employee1});
  const createdEmployee2 = await prisma.employee.create({data:filteredEmployee2});


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
  
  const address =address1;
  const {address:address2,...filteredEmployee2} = employee2;

  const employee1Address = await prisma.address.create({data:address});
  employee1.addressId=employee1Address.id

  const employee2Address = await prisma.address.create({data:address2});

  const createdEmployee = await prisma.employee.create({data:employee1});
  const createdEmployee2 = await prisma.employee.create({data:filteredEmployee2});


  const { jwtKey, expiresIn } = jwtConfig();

  const token: string = sign({ accessLevel: createdEmployee.accessLevel }, jwtKey, {
    expiresIn: expiresIn,
    subject: createdEmployee.publicId,
  });
  
  const {publicId} = createdEmployee2;

  const response = await request.delete(`/employee/${publicId}`).set("Authorization", `Bearer ${token}`);
  
  expect(response.statusCode).toBe(403);

});

test("Should be able to Login as an ADM",async ()=>{

  const employeeAddress= await prisma.address.create({data:address1});
  const employeeADM = await createAdmEmployee();
  employeeADM.addressId=employeeAddress.id;
  const createdAdm = await prisma.employee.create({data:employeeADM});
 
const loginData = {
  email:employeeADM.email,
  password: "Teste123*"
};
    
  const response = await request.post("/employee/login").send(loginData);

  const expectedResponseBody = {   
    token:expect.any(String),
    employee:{
      publicId:createdAdm.publicId,
      name:createdAdm.name,
      email:createdAdm.email,
      birthDate: createdAdm.birthDate.toISOString(),
		  CPF: createdAdm.CPF,
		  phone: createdAdm.phone,
		  accessLevel: createdAdm.accessLevel
    }
    
  };
      
  expect(response.body).toEqual(expectedResponseBody);
  expect(response.statusCode).toBe(200);

});

test("Should be able to Login as an Employee",async ()=>{

  const employeeAddress= await prisma.address.create({data:address1});
  const employee = await createFuncEmployee();
  employee.addressId=employeeAddress.id;
  const createdEmployee = await prisma.employee.create({data:employee});
 
const loginData = {
  email:employee.email,
  password: "Teste123*"
};
    
  const response = await request.post("/employee/login").send(loginData);

  const expectedResponseBody = {   
    token:expect.any(String),
    employee:{
      publicId:createdEmployee.publicId,
      name:createdEmployee.name,
      email:createdEmployee.email,
      birthDate: createdEmployee.birthDate.toISOString(),
		  CPF: createdEmployee.CPF,
		  phone: createdEmployee.phone,
		  accessLevel: createdEmployee.accessLevel
    }
    
  };
      
  expect(response.body).toEqual(expectedResponseBody);
  expect(response.statusCode).toBe(200);

});

test("Should return an error if use a wrong email",async ()=>{

  const employeeAddress= await prisma.address.create({data:address1});
  const employee = await createFuncEmployee();
  employee.addressId=employeeAddress.id;
  const createdEmployee = await prisma.employee.create({data:employee});
 
const loginData = {
  email:"email.errado@gmail.com",
  password: "Teste123*"
};
    
  const response = await request.post("/employee/login").send(loginData);
  
      
  expect(response.statusCode).toBe(401);

});

test("Should return an error if use a wrong password",async ()=>{

  const employeeAddress= await prisma.address.create({data:address1});
  const employee = await createFuncEmployee();
  employee.addressId=employeeAddress.id;
  const createdEmployee = await prisma.employee.create({data:employee});
 
const loginData = {
  email:createdEmployee.email,
  password: "SenhaErrada1*"
};
    
  const response = await request.post("/employee/login").send(loginData);
  
      
  expect(response.statusCode).toBe(401);

});

});