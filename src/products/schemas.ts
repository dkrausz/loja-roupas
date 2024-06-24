import {z} from "zod"

const productSchema = z.object({
  id: z.number().min(1),
  publicId : z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().min(1).positive(),
  orders: z.number().nullish(),
  StoreId: z.number().positive().optional(),//mudar para obrigatorio  
});

const returnProductSchema = productSchema.omit({id:true});
const createProductBodySchema = productSchema.omit({id:true, publicId:true,orders:true});
const updateProductSchema = createProductBodySchema.partial();

export{productSchema,returnProductSchema,createProductBodySchema,updateProductSchema};