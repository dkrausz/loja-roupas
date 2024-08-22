import { container } from "tsyringe";
import { prisma } from "../../database/prisma";
import { address1, address2, createAdmEmployee, store } from "../utils/Employee.mock";
import { EmployeeServices } from "../../employee/services";
import { Factory } from "../utils/factory";


describe("Employee unit test" ,()=>{

  beforeAll(async()=>{
    await prisma.order.deleteMany();
    await prisma.employee.deleteMany();
    await prisma.product.deleteMany();
    await prisma.client.deleteMany();
    await prisma.store.deleteMany();
    await prisma.address.deleteMany();
  });

  afterAll(async()=>{
    await prisma.order.deleteMany();
    await prisma.employee.deleteMany();
    await prisma.product.deleteMany();
    await prisma.client.deleteMany();
    await prisma.store.deleteMany();
    await prisma.address.deleteMany();
  });

  beforeEach(() => {
    container.clearInstances();
    container.reset();
  });

  test("Should be able to create a new employee",async ()=>{
    const factory = new Factory();
 
    const employeeServive=container.resolve(EmployeeServices);

    const newStoreAddress = await prisma.address.create({data:address1});
    const storeMock = store;
    storeMock.addressId = newStoreAddress.id;
    const newStore = await prisma.store.create({data:storeMock});   

    const employeeAdmMock = factory.employeeFactory();
    
    employeeServive.create(employeeAdmMock)


  });






});