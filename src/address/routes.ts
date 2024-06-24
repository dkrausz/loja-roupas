import { Router } from "express";
import { container } from "tsyringe";
import { AddressService } from "./service";
import { AddressController } from "./controller";


export const addressRoute = Router();
container.registerSingleton("AddressService", AddressService);
const addressController = container.resolve(AddressController);

