import { inject } from "tsyringe";
import { IProductService } from "./interfaces";
import { Request, Response } from "express";


export class ProductController{

  constructor(@inject("ProductService") private service:IProductService){}

  public createProduct = async(req:Request, res:Response):Promise<Response>=>{
    const newProduct = await this.service.createProduct(req.body);
    return res.status(201).json(newProduct);
  }; 

  public getProducts = async(req:Request, res:Response):Promise<Response>=>{
    const {productName} = req.query;
    const products = await this.service.getProducts(productName as string);
    return res.status(200).json(products);
  };

  public getOneProduct = async(req:Request, res:Response):Promise<Response>=>{
    const product = await this.service.getOneProduct(req.params.productId);
    return res.status(200).json(product);
  };
  

  public updateProduct = async(req:Request, res:Response):Promise<Response>=>{
    const updatedProduct = await this.service.updateProduct(req.body,req.params.productId);
    return res.status(200).json(updatedProduct);
  };

  public deleteProduct = async(req:Request, res:Response):Promise<Response>=>{
    await this.service.deleteProduct(req.params.productId);
    return res.status(204).json("");
  };
  
};