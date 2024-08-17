import { injectable } from "tsyringe";
import { IEmployeeService, TCreateEmployee, TEmployee, TEmployeeReturn, TUpdateEmployee } from "./interfaces";
import { returnEmployeeCreateSchema} from "./schemas";
import { prisma } from "../database/prisma";
import bcryptjs from "bcryptjs";
import { AppError } from "../@shared/errors";
import { TUpdateAddressBody } from "../address/interfaces";
import { jwtConfig } from "../configs/auth.config";
import { sign } from "jsonwebtoken";
import { TemployeeLogin, TemployeeLoginReturn } from "./interfaces";

injectable();

export class EmployeeServices implements IEmployeeService {
  async getMany(): Promise<TEmployeeReturn[]> {
    const employeeList = await prisma.employee.findMany();

    return returnEmployeeCreateSchema.array().parse(employeeList);
  }

  async getOne(publicId: string): Promise<TEmployeeReturn> {
    const employee = await prisma.employee.findFirst({ where: { publicId },include:{address:true} });

    return returnEmployeeCreateSchema.parse(employee);
  }

  async create(body: TCreateEmployee): Promise<TEmployeeReturn> {
    
    
    const newAddress = await prisma.address.create({ data: body.address });

    const pwd = await bcryptjs.hash(body.password, 10);

    const dataValue = new Date(body.birthDate);

    // const {address, ...newEmployee} = body;   

    const newEmployee = {
      name: body.name,
      email:body.email,
      password: pwd,
      birthDate: dataValue,
      CPF: body.CPF,
      addressId: newAddress.id,
      phone: body.phone,
      accessLevel: body.accessLevel,
      storeId: body.storeId,
    };

    const employee = await prisma.employee.create({ data: newEmployee, include: { address: true , store:true} });

    return returnEmployeeCreateSchema.parse(employee);
  }


  async update(publicId: string, body: TUpdateEmployee): Promise<TEmployeeReturn> {
    const employee = await prisma.employee.findFirst({ where: { publicId } });
    if(!employee){
      throw new AppError(404, "Employee not fond!");
    }
   
    const {address,...employeeUpdatePayload} = body;      
    
    await prisma.employee.update({where: {id:employee.id }, data: employeeUpdatePayload,include:{address:true}});
    if(body.address){         
      const updateAddressBody:TUpdateAddressBody = body.address;
      await prisma.address.update({where:{id:employee.addressId as number},data:updateAddressBody})
    }
    const updatedEmployee = await prisma.employee.findFirst({where:{id:employee.id},include:{address:true}});
    return returnEmployeeCreateSchema.parse(updatedEmployee);
  }

  async delete(publicId:string):Promise<void> {
    await prisma.employee.delete({where: {publicId}});     
    return     

  }

  public login= async(body: TemployeeLogin): Promise<TemployeeLoginReturn> =>{
    const employee = await prisma.employee.findFirst({where: { email: body.email }});
   
    
    if (!employee) {
      throw new AppError(401,"name and password doesn't match.")
    }

    const compare = await bcryptjs.compare(body.password, employee.password);

    if (!compare) {      
      throw new AppError(401,"name and password doesn't match.")
    }

    const { jwtKey, expiresIn } = jwtConfig();
    const tokenGen: string = sign({ accessLevel: employee.accessLevel }, jwtKey, {
      expiresIn: expiresIn,
      subject: employee.publicId,
    });

    return { token: tokenGen, employee: returnEmployeeCreateSchema.parse(employee) };
  };
}
