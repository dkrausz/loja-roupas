import { z } from "zod";
import { createAddressBodySchema, returnAddressBodySchema } from "../address/schemas";
import { getStoreSchema } from "../store/schemas";
import { AccessLevel } from "@prisma/client";

 const employeeSchema = z.object({
    id: z.number().positive(),
    publicId: z.string(),
    name: z.string().max(255).min(1),
    email: z.string().email().min(1),
    password: z.string().min(8).max(50).regex(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/),
    birthDate: z.coerce.date().max(new Date()),
    CPF: z.string().max(11).min(1),
    addressId: z.number().nullish(),
    phone: z.string().max(11).nullish(),
    accessLevel: z.nativeEnum(AccessLevel,{message:"You have to choose between FUNCIONARIO or ADM "}),    
    
});

 const returnEmployeeCreateSchema = employeeSchema.extend({ address: returnAddressBodySchema.nullish(), store: getStoreSchema.nullish() }).omit({ id: true, password: true , addressId:true});
 const createEmployeeSchema = employeeSchema.omit({id: true, publicId: true}).extend({address:createAddressBodySchema});
 const employeeBodyWithoutAddress= employeeSchema.omit({id:true,publicId:true, addressId:true});
 const updateEmployeeSchema = createEmployeeSchema.partial(); 
 
 const employeeLogin = employeeSchema.pick({email: true,password: true,});

export {employeeSchema,returnEmployeeCreateSchema,createEmployeeSchema,updateEmployeeSchema,employeeBodyWithoutAddress,employeeLogin};


