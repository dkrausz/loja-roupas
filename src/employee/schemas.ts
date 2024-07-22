import { z } from "zod";
import { addressSchema, createAddressBodySchema } from "../address/schemas";
import { storeSchema } from "../store/schemas";
import { AccessLevel } from "@prisma/client";

export const employeeSchema = z.object({
    id: z.number().positive(),
    publicId: z.string(),
    name: z.string().max(255).min(1),
    password: z.string().min(8).max(50).regex(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/),
    birthDate: z.coerce.date().max(new Date()),
    CPF: z.string().max(11).min(1),
    addressId: z.number().nullish(),
    phone: z.string().max(11).nullish(),
    accessLevel: z.nativeEnum(AccessLevel),    
    storeId: z.number(),
});

export const returnEmployeeSchema = employeeSchema.extend({ address: addressSchema.nullish(), store: storeSchema.nullish() }).omit({ id: true, password: true});

export const createEmployeeSchema = employeeSchema.omit({id: true, publicId: true}).extend({address:createAddressBodySchema});

export const updateEmployeeSchema = createEmployeeSchema.partial();

export type TEmployee = z.infer<typeof employeeSchema>;

export type TCreateEmployee = z.infer<typeof createEmployeeSchema>;

export type TUpdateEmployee = z.infer<typeof updateEmployeeSchema>;

export type TEmployeeReturn = z.infer<typeof returnEmployeeSchema>;




