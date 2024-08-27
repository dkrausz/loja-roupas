import { container } from "tsyringe";
import { prisma } from "../../database/prisma";
import { address1, address2, createAdmEmployee, store } from "../utils/Employee.mock";
import { EmployeeServices } from "../../employee/services";
import { Factory } from "../utils/factory";
import { initStore } from "../../configs/initStore.config";
import { loadedStore } from "../../app";


describe("Employee unit test" ,()=>{
  const factory = new Factory();
 
  beforeAll(async()=>{
    await prisma.order.deleteMany();
    await prisma.employee.deleteMany();
    await prisma.product.deleteMany();
    await prisma.client.deleteMany();
    await prisma.store.deleteMany();
    await prisma.address.deleteMany();
   
    const newStoreAddress = await prisma.address.create({data:address1});
    const storeMock = store;
    storeMock.addressId = newStoreAddress.id;
    const newStore = await prisma.store.create({data:storeMock});   
    loadedStore.id=newStore.id;
    await initStore(loadedStore);


  });

  beforeEach(async() => { 
    container.reset();
    await prisma.employee.deleteMany();
  });

  // afterAll(async()=>{
  //   await prisma.order.deleteMany();
  //   await prisma.employee.deleteMany();
  //   await prisma.product.deleteMany();
  //   await prisma.client.deleteMany();
  //   await prisma.store.deleteMany();
  //   await prisma.address.deleteMany();
  // });

  

  test("Should be able to create a new employee",async ()=>{    
    const employeeServive=container.resolve(EmployeeServices);
    
    const employeeAdmMock = factory.employeeFactory();
    
    employeeServive.create(employeeAdmMock)


  });

});