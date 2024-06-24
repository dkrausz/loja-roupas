import { z } from "zod";
import { orderRegisterSchema, orderSchema, orderUpdateSchema } from "./schemas";

export type TOrder = z.infer<typeof orderSchema>;
export type TOrderRegister = z.infer<typeof orderRegisterSchema>;
export type TOrderUpdate = z.infer<typeof orderUpdateSchema>;
