import { z } from "zod";
import { productSchema, returnProductSchema } from "../products/schemas";
import { clientReturnSchema } from "../client/schemas";

export const orderSchema = z.object({
  id: z.number().positive(),
  publicId: z.string(),
  date: z.date().default(() => new Date()),
  paymentType: z.enum(["PIX", "CARTAO_CREDITO", "BOLETO"]),
  clientId: z.number().positive(),
  status: z.enum(["IN_PROGRESS", "COMPLETED", "DELIVERED"]),
  discount: z.boolean(),
  total: z.number().positive(),
  storeId: z.number(),
  products: productSchema.array(),
});

const orderProductInputSchema = z.object({
  productPublicId: z.string().min(1),
  quantity: z.number().positive(),
});

export const orderRegisterSchema = z.object({
  paymentType: z.enum(["PIX", "CARTAO_CREDITO", "BOLETO"]),
  status: z.enum(["IN_PROGRESS", "COMPLETED", "DELIVERED"]),
  discount: z.boolean().default(false),
  orderItems: z.array(orderProductInputSchema).min(1),
});

export const orderUpdateSchema = orderRegisterSchema.partial();

const itemListSchema = z.object({
  orderId: z.number().min(1),
  productId: z.number().min(1),
  quantity: z.number().min(1),
  priceUnit: z.number().min(1),
  subTotal: z.number().min(1),
  product: productSchema.omit({ id: true, orders: true, storeId: true }),
});

export const returnOrderSchema = orderSchema.omit({ id: true, clientId: true, storeId: true, products: true }).extend({
  client: clientReturnSchema.omit({ birthDate: true, CPF: true, phone: true, address: true, storeId: true }),
  orderItems: itemListSchema.omit({ productId: true }).array(),
});
