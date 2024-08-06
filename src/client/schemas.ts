import z from "zod";
import { addressSchema } from "../address/schemas";

const minValidDate = () => {
  const nowDate = new Date();
  const minAge = nowDate.setFullYear(
    nowDate.getFullYear() - 18,
    nowDate.getMonth(),
    nowDate.getDay()
  );
  return minAge;
};

export const clientSchema = z.object({
  id: z.number().positive(),
  publicId: z.string(),
  name: z.string().max(255),
  email: z.string().email(),
  password: z.string().min(8).max(50)
    .regex(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/),
  birthDate: z.coerce.date().max(new Date(minValidDate())),
  CPF: z.string().max(11),
  phone: z.string().max(11),
  addressId: z.number().array().nullish(),
  storeId: z.number().positive(),
});

export const clientRegisterSchema = clientSchema.omit({
  id: true,
  publicId: true,
});

export const clientReturnSchema = clientSchema
  .omit({ id: true, password: true })
  .extend({ address: addressSchema.array() });

export const clientUpdateSchema = clientSchema
  .pick({name: true,
    email: true,
    birthDate: true,
    phone: true,
    password: true,
  })
  .partial();
