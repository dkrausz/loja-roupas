import { Router } from "express";
import { container } from "tsyringe";
import {  ProductService } from "./service";
import {  ProductController } from "./controller";
import { ValidateToken } from "../@shared/validateToken.middleware";
import { bodyMiddleware } from "../@shared/body.middeware";
import { createProductBodySchema, updateProductSchema } from "./schemas";
import { whoHasAcess } from "../@shared/whoHasAccess.middleware";


export const productRoute = Router();
container.registerSingleton("ProductService", ProductService);
const productController = container.resolve(ProductController);


productRoute.post("/",ValidateToken.execute,whoHasAcess.permission("ADM","employee"),bodyMiddleware.bodyIsValid(createProductBodySchema),productController.createProduct);
productRoute.get("/",productController.getProducts);
productRoute.get("/:productId",productController.getOneProduct);
productRoute.patch("/:productId",ValidateToken.execute,whoHasAcess.permission("ADM","employee"),bodyMiddleware.bodyIsValid(updateProductSchema),productController.updateProduct);
productRoute.delete("/:productId",ValidateToken.execute,whoHasAcess.permission("ADM"),productController.deleteProduct);


