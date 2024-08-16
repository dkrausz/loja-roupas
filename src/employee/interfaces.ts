import {
  createEmployeeSchema,
  employeeBodyWithoutAddress,
  employeeLogin,
  employeeSchema,
  returnEmployeeCreateSchema,
  updateEmployeeSchema,
} from "./schemas";
import { z } from "zod";

interface IEmployeeService {
  getMany(): Promise<TEmployeeReturn[]>;
  getOne(publicId: string): Promise<TEmployeeReturn>;
  create(body: TCreateEmployee): Promise<TEmployeeReturn>;
  update(publicId: string, body: TUpdateEmployee): Promise<TEmployeeReturn>;
  delete(publicId: string): void;
  login(body: TemployeeLogin): Promise<TemployeeLoginReturn>;
}

type TemployeeLogin = z.infer<typeof employeeLogin>;

type TemployeeLoginReturn = { token: string; employee: TEmployeeReturn };

type TEmployee = z.infer<typeof employeeSchema>;

type TCreateEmployee = z.infer<typeof createEmployeeSchema>;

type TemployeeBodyWithoutAddress = z.infer<typeof employeeBodyWithoutAddress>;

type TUpdateEmployee = z.infer<typeof updateEmployeeSchema>;

type TEmployeeReturn = z.infer<typeof returnEmployeeCreateSchema>;

export {
  IEmployeeService,
  TEmployee,
  TCreateEmployee,
  TUpdateEmployee,
  TEmployeeReturn,
  TemployeeLogin,
  TemployeeLoginReturn,
  TemployeeBodyWithoutAddress
};
