import { z } from "zod";
import { productSchema, returnProductSchema } from "../products/schemas";

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
  products: productSchema.array().nullish(),
});

// export const registerProductInOrderSchema = orderSchema
//   .pick({ id: true })
//   .extend({ idProduct: z.number().positive(), qtd: z.number().positive() });

export const orderRegisterSchema = orderSchema.omit({
  id: true,
  publicId: true,
  // products: true,
});

export const orderUpdateSchema = orderSchema
  .pick({
    paymentType: true,
    status: true,
    discount: true,
    total: true,
    // products: true,
  })
  .partial();

export const returnOrderSchema = orderSchema
  .omit({ id: true, storeId: true })
  .extend({
    products: productSchema.omit({ id: true, storeId: true }).array(),
  });
