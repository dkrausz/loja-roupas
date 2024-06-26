import { injectable } from "tsyringe";
import { TCreateEmployee, TEmployeeReturn, TUpdateEmployee, employeeSchema } from "./schemas";
import { prisma } from "../database/prisma";

injectable()
export class EmployeeServices {
    async getMany(): Promise<TEmployeeReturn[]> {
        const employeeList = await prisma.employee.findMany();

        return employeeList;
    };

    async getOne(id: number): Promise<TEmployeeReturn> {
        const employee = await prisma.employee.findFirst({ where: { id } });

        return employeeSchema.parse(employee);
    };

    async create(body: TCreateEmployee): Promise<TEmployeeReturn> {
        const newEmployee = await prisma.employee.create({ data: body });

        return employeeSchema.parse(newEmployee);
    };

    async update(id: number, body: TUpdateEmployee): Promise<TEmployeeReturn> {
        const updateEmployee = await prisma.employee.findFirst({ where: { id } });

        const updatedEmployee = { ...updateEmployee, ...body };

        return employeeSchema.parse(updatedEmployee);
    };

    async delete(id: number) {
        return prisma.employee.delete({ where: { id } });
    };
};