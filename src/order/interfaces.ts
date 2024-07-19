import { z } from "zod";
import {
  orderRegisterSchema,
  orderSchema,
  orderUpdateSchema,
  registerProductInOrderSchema,
  returnOrderSchema,
} from "./schemas";
import { TProduct } from "../products/interfaces";

export type TOrder = z.infer<typeof orderSchema>;
export type TOrderRegister = z.infer<typeof orderRegisterSchema>;
export type TOrderUpdate = z.infer<typeof orderUpdateSchema>;
export type TRegisterProductInOrder = z.infer<
  typeof registerProductInOrderSchema
>;
export type TPayloadOrder = TOrderRegister & { products: number[] };

export type TOrderList = TOrder & { items: TProduct[] };
export type TReturnOrder = z.infer<typeof returnOrderSchema>;
