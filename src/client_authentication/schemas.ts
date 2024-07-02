import { z } from "zod";
import { clientSchema } from "../client/schemas.ts";

export const clientLoginSchema = clientSchema.pick({
  email: true,
  password: true,
});
