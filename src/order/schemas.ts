import { z } from "zod";

export const orderSchema = z.object({
  id: z.number().positive(),
  publicId: z.string(),
  date: z.date(),
  paymentType: z.enum(["PIX", "CARTAO_CREDITO", "BOLETO"]),
  clientId: z.number().positive(),
  status: z.enum(["IN_PROGRESS", "COMPLETED", "DELIVERED"]),
  discount: z.boolean(),
  total: z.number().positive(),
  storeId: z.number(),
});

export const orderRegisterSchema = orderSchema.omit({
  id: true,
  publicId: true,
});

export const orderUpdateSchema = orderSchema
  .pick({
    paymentType: true,
    status: true,
    discount: true,
    total: true,
  })
  .partial();
