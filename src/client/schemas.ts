import z from "zod";

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
  password: z
    .string()
    .min(8)
    .max(50)
    .regex(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/),
  birthDate: z.date().min(new Date(minValidDate())),
  cpf: z.string().max(11),
  phone: z.string().max(11),
  storeId: z.number().positive(),
});

export const clientRegisterSchema = clientSchema.omit({
  id: true,
  publicId: true,
});

export const clientReturnSchema = clientSchema.omit({ password: true });

export const clientUpdateSchema = clientSchema
  .pick({
    name: true,
    email: true,
    birthDate: true,
    phone: true,
    password: true,
  })
  .partial();
