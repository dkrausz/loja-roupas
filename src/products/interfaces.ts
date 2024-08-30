import { z } from "zod"
import { createProductBodySchema, productSchema, returnProductSchema, updateProductSchema } from "./schemas"
import { paginationResponse } from "../@shared/pagination.interface";


type TProduct = z.infer<typeof productSchema>;
type TReturnProduct = z.infer<typeof returnProductSchema>;
type TCreateProductBody = z.infer<typeof createProductBodySchema>;
type TUpdateProductBody = z.infer<typeof updateProductSchema>;

interface IProductService{
  createProduct(payload:TCreateProductBody):Promise<TReturnProduct>;  
  getProducts( page:number, perPage:number,previousPage:string,nextPage:string,search?:string):Promise<paginationResponse<TReturnProduct>>;
  getOneProduct(publicId:String):Promise<TReturnProduct>;
  updateProduct(payload:TUpdateProductBody,publicId:string):Promise<TReturnProduct>;
  deleteProduct(publicId:string):Promise<void>;
}

export{TProduct,TReturnProduct,TCreateProductBody,IProductService,TUpdateProductBody};
