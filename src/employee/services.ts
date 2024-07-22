import { injectable } from "tsyringe";
import { TCreateEmployee, TEmployee, TEmployeeReturn, TUpdateEmployee, returnEmployeeSchema } from "./schemas";
import { prisma } from "../database/prisma";
import bcryptjs from "bcryptjs";
import { AccessLevel } from "@prisma/client";


injectable()
export class EmployeeServices {
    async getMany(): Promise<TEmployeeReturn[]> {
        const employeeList = await prisma.employee.findMany();

        return returnEmployeeSchema.array().parse(employeeList);
    };

    async getOne(id: number): Promise<TEmployeeReturn> {
        const employee = await prisma.employee.findFirst({ where: { id } });

        return returnEmployeeSchema.parse(employee);
    };

    async create(body: TCreateEmployee): Promise<TEmployeeReturn> {

        const newAddress = await prisma.address.create({data:body.address});  

        const pwd = await bcryptjs.hash(body.password, 10);

        const dataValue = new Date(body.birthDate);    
      
        const newEmployee = {name: body.name, password: pwd, birthDate: dataValue , CPF:body.CPF, 
            addressId:newAddress.id,phone:body.phone, accessLevel : body.accessLevel, storeId:body.storeId};       

        const employee = await prisma.employee.create({ data: newEmployee,include:{address:true} });    
      

        return returnEmployeeSchema.parse(employee);
    };

    async update(id: number, body: TUpdateEmployee): Promise<TEmployeeReturn> {

        const updateEmployee = await prisma.employee.findFirst({ where: { id } });


        const updatedEmployee = { ...updateEmployee, ...body };


        return returnEmployeeSchema.parse(updatedEmployee);
    };

    async delete(id: number) {
        return prisma.employee.delete({ where: { id } });
    };
};