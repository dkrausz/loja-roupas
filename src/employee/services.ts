import { injectable } from "tsyringe";

import { IEmployeeService, TCreateEmployee, TEmployee, TEmployeeReturn, TUpdateEmployee } from "./interfaces";
import {employeeBodyWithoutAddress, returnEmployeeCreateSchema} from "./schemas";


import { prisma } from "../database/prisma";
import bcryptjs from "bcryptjs";
import { AppError } from "../@shared/errors";
import { TUpdateAddressBody } from "../address/interfaces";

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


    const newEmployee = {
      name: body.name,
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
}
