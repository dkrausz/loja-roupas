import { injectable } from "tsyringe";
import { TCreateEmployee, TEmployee, TEmployeeReturn, TUpdateEmployee, returnEmployeeSchema } from "./schemas";
import { prisma } from "../database/prisma";


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
        const newEmployee = await prisma.employee.create({ data: body });

        return returnEmployeeSchema.parse(newEmployee);
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