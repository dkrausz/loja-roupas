import { prisma } from "../database/prisma";
import {IProductService, TCreateProductBody, TReturnProduct,TUpdateProductBody} from "./interfaces";
import { returnProductSchema } from "./schemas";

export class ProductService implements IProductService {
  public create = async (payload: TCreateProductBody): Promise<TReturnProduct> => {
    const newProduct = await prisma.product.create({ data: payload });
    return returnProductSchema.parse(newProduct);
  };

  public getAllProducts = async (): Promise<Array<TReturnProduct>> => {
    const products = await prisma.product.findMany();
    return returnProductSchema.array().parse(products);
  };

  public getOneProduct = async (publicId: string): Promise<TReturnProduct> => {
    const product = await prisma.product.findFirst({ where: { publicId } });
    return returnProductSchema.parse(product);
  };

  public getProducts = async (search: string): Promise<Array<TReturnProduct>> => {
    const products = await prisma.product.findMany({ where: { name: search } });
    return returnProductSchema.array().parse(products);
  };

  public updateProduct = async (payload: TUpdateProductBody,publicId: string): Promise<TReturnProduct> => {
    const productId = await prisma.product.findFirst({where:{publicId}});
    const product = await prisma.product.update({where: { id: productId!.id },data: payload});
    return returnProductSchema.parse(product);
  };

  public deleteProduct = async(publicId:string):Promise<void>=>{
    const productId = await prisma.product.findFirst({where:{publicId}});
    await prisma.product.delete({where:{id:productId!.id}});
  };

  
}
