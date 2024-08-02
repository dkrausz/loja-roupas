import { injectable } from "tsyringe";
import { prisma } from "../database/prisma";
import { IProductService, TCreateProductBody, TReturnProduct, TUpdateProductBody } from "./interfaces";
import { returnProductSchema } from "./schemas";
import { AppError } from "../@shared/errors";

@injectable()
export class ProductService implements IProductService {
  public createProduct = async (payload: TCreateProductBody): Promise<TReturnProduct> => {
    const newProduct = await prisma.product.create({ data: payload });
    return returnProductSchema.parse(newProduct);
  };

  public getOneProduct = async (publicId: string): Promise<TReturnProduct> => {
    const product = await prisma.product.findFirst({ where: { publicId } });
    if(!product){
      throw new AppError(404, "Product not found");
    };
    return returnProductSchema.parse(product);
  };

  public getProducts = async (search?: string): Promise<Array<TReturnProduct>> => {
    let products;  

    if (search) {
      products = await prisma.product.findMany({ where: { name: search } });
    } else {
      products = await prisma.product.findMany();
    }
    return returnProductSchema.array().parse(products);
  };

  public updateProduct = async (payload: TUpdateProductBody, publicId: string): Promise<TReturnProduct> => {
  
    const productId = await prisma.product.findFirst({ where: { publicId } });

    if (!productId) {
      throw new AppError(404, "Product not found");
    }

    const product = await prisma.product.update({ where: { id: productId!.id }, data: payload });
    return returnProductSchema.parse(product);
  };

  public deleteProduct = async (publicId: string): Promise<void> => {
    const productId = await prisma.product.findFirst({ where: { publicId } });
    await prisma.product.delete({ where: { id: productId!.id } });
  };
}
