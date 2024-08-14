import { injectable } from "tsyringe";
import { prisma } from "../database/prisma";
import { IProductService, TCreateProductBody, TReturnProduct, TUpdateProductBody } from "./interfaces";
import { returnProductSchema } from "./schemas";
import { AppError } from "../@shared/errors";
import { paginationResponse } from "../@shared/pagination.interface";

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

  public getProducts = async (page:number,perPage:number,previousPage:string,nextPage:string,search?: string): Promise<paginationResponse<TReturnProduct>> => {
    let products;  
    let count;
    if (search) {
      products = await prisma.product.findMany({ where: { name: search } ,skip:perPage*(page-1),take:perPage});
      count = await prisma.product.count({where:{name:search}});
    } else {
      products = await prisma.product.findMany({skip:perPage*(page-1),take:perPage,});
      count = await prisma.product.count();
    }

    const lastPage = Math.ceil(count/perPage);
          
    const returnPagination={
      count:count,
      previousPage:previousPage,
      nextPage:nextPage.replace("lastpage",(page+1>lastPage?`${lastPage}`:`${page+1}`)),
      data:returnProductSchema.array().parse(products)
    }
    return returnPagination;
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
