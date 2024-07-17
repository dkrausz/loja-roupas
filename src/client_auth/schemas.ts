import { z } from "zod";
import { clientSchema } from "../client/schemas";

export const clientLoginSchema = clientSchema.pick({
  email: true,
  password: true,
});
