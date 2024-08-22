import { Router } from "express";
import { container } from "tsyringe";
import { AddressService } from "./service";
import { AddressController } from "./controller";
import { bodyMiddleware } from "../@shared/body.middeware";
import { createAddressBodySchema } from "./schemas";

export const addressRoute = Router();
container.registerSingleton("AddressService", AddressService);
const addressController = container.resolve(AddressController);

addressRoute.post(
  "/:id",
  bodyMiddleware.bodyIsValid(createAddressBodySchema),
  addressController.createAddress
);
