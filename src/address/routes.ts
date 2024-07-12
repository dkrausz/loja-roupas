import { Router } from "express";
import { container } from "tsyringe";
import { AddressService } from "./service";
import { AddressController } from "./controller";
import { bodyMiddleware } from "../@shared/body.middeware";
import { createBodySchema } from "./schemas";


export const addressRoute = Router();
container.registerSingleton("AddressService", AddressService);
const addressController = container.resolve(AddressController);

addressRoute.post("/", bodyMiddleware.bodyIsValid(createBodySchema),addressController.createAddress);

