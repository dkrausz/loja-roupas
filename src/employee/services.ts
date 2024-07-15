import { injectable } from "tsyringe";
import { TCreateEmployee, TEmployee, TEmployeeReturn, TUpdateEmployee, returnEmployeeSchema } from "./schemas";
import { prisma } from "../database/prisma";
import bcryptjs from "bcryptjs";


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
        const pwd = await bcryptjs.hash(body.password, 10);

        const dataValue = new Date(body.birthDate);

        const newEmployee = { ...body, birthDate: dataValue , password: pwd };


        const employee = await prisma.employee.create({ data: newEmployee });

        return returnEmployeeSchema.parse(employee);
    };

    async update(id: number, body: TUpdateEmployee): Promise<TEmployeeReturn> {
        const updateEmployee = await prisma.employee.findFirst({ where: { id } });

        if (body.birthDate) {
            body.birthDate = new Date(body.birthDate);
        }

        const updatedEmployee = { ...updateEmployee, ...body };

        console.log(updatedEmployee);

        return returnEmployeeSchema.parse(updatedEmployee);
    };

    async delete(id: number) {
        return prisma.employee.delete({ where: { id } });
    };
};