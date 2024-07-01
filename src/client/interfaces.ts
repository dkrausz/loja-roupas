import { z } from "zod";
import {
  clientRegisterSchema,
  clientReturnSchema,
  clientSchema,
  clientUpdateSchema,
} from "./schemas";

export type TClient = z.infer<typeof clientSchema>;
export type TClientRegister = z.infer<typeof clientRegisterSchema>;
export type TClientReturn = z.infer<typeof clientReturnSchema>;
export type TClientUpdate = z.infer<typeof clientUpdateSchema>;
