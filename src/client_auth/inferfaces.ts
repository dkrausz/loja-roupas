import { z } from "zod";
import { clientLoginSchema } from "./schemas";
import { TClientReturn } from "../client/interfaces";

export type TClientLogin = z.infer<typeof clientLoginSchema>;
export type TClientLoginReturn = {
  token: string;
  client: TClientReturn;
};
