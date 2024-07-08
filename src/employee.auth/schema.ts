import { z } from "zod";
import { employeeSchema, TEmployeeReturn } from "../employee/schemas";


export const employeeLogin = employeeSchema.pick({
    name: true,
    password: true,
});

export type TemployeeLogin = z.infer<typeof employeeLogin>;

export type TemployeeLoginReturn = {
    token: string;
    employee: TEmployeeReturn;
};

