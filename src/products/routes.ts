import { Router } from "express";
import { container } from "tsyringe";
import {  ProductService } from "./service";
import {  ProductController } from "./controller";


export const productRoute = Router();
container.registerSingleton("ProductService", ProductService);
const productController = container.resolve(ProductController);


productRoute.get("/",productController.getProducts);
productRoute.get("/:id",productController.getOneProduct);


