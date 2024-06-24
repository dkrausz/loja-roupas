import { z } from "zod";
import {
  clientLoginSchema,
  clientRegisterSchema,
  clientReturnSchema,
  clientSchema,
  clientUpdateSchema,
} from "./schemas";

export type TClient = z.infer<typeof clientSchema>;
export type TClientRegister = z.infer<typeof clientRegisterSchema>;
export type TClientReturn = z.infer<typeof clientReturnSchema>;
export type TClientLogin = z.infer<typeof clientLoginSchema>;
export type TClientUpdate = z.infer<typeof clientUpdateSchema>;
