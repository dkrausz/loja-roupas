import { createEmployeeSchema, employeeSchema, returnEmployeeCreateSchema,  updateEmployeeSchema } from "./schemas";
import {z} from "zod"



interface IEmployeeService{
  getMany():Promise<TEmployeeReturn[]>;
  getOne(publicId: string):Promise<TEmployeeReturn>;
  create(body:TCreateEmployee):Promise<TEmployeeReturn>;
  update(publicId:string, body:TUpdateEmployee):Promise<TEmployeeReturn>;
  delete(publicId:string):void;

}

type TEmployee = z.infer<typeof employeeSchema>;

type TCreateEmployee = z.infer<typeof createEmployeeSchema>;

type TUpdateEmployee = z.infer<typeof updateEmployeeSchema>;

type TEmployeeReturn = z.infer<typeof returnEmployeeCreateSchema>;

export {IEmployeeService, TEmployee, TCreateEmployee, TUpdateEmployee, TEmployeeReturn};
