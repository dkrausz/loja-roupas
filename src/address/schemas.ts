import {z} from "zod";

const addressSchema = z.object({
  id:z.number().positive().min(1),
  street: z.string().min(1).max(100),
  number: z.number().min(1),
  complement: z.string().max(100).nullish(),
  zipCode : z.string().regex(/^\d{5}-\d{3}$/, {message:"zipCode must be in format XXXXX-XXX",}),
  neighborhood: z.string().min(1).max(20),
  state: z.string().min(2).max(20),
  city: z.string().min(1).max(50),
  country: z.string().min(1).max(20),
  clientId: z.number().min(1).nullish(), 
});

const createAddressBodySchema = addressSchema.omit({id:true});
const updateAddressBodySchema = createAddressBodySchema.partial();
const returnAddressBodySchema = addressSchema.omit({id:true, clientId:true});

export{addressSchema,createAddressBodySchema, updateAddressBodySchema,returnAddressBodySchema};