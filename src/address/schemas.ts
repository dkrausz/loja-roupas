import {z} from "zod";

const addressSchema = z.object({
  id:z.number().positive().min(1),
  street: z.string().min(1).max(100),
  number: z.number().min(1),
  complement: z.string().max(100).optional(),
  zipCode : z.string().min(9).max(9),
  neighborhood: z.string().min(1).max(20),
  state: z.string().min(2).max(20),
  city: z.string().min(1).max(20),
  country: z.string().min(1).max(20),
  clientId: z.number().min(1).optional(), 
});

const createBodySchema = addressSchema.omit({id:true});
const updateBodySchema = createBodySchema.partial();

export{addressSchema,createBodySchema, updateBodySchema};