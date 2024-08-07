import { z } from "zod";
import {
  orderRegisterSchema,
  orderSchema,
  orderUpdateSchema,
  returnOrderSchema,
} from "./schemas";

export type TOrder = z.infer<typeof orderSchema>;
export type TOrderRegister = z.infer<typeof orderRegisterSchema>;
export type TOrderUpdate = z.infer<typeof orderUpdateSchema>;
export type TPayloadOrder = TOrderRegister; /*& { products: number[] };*/
export type TReturnOrder = z.infer<typeof returnOrderSchema>;
