import { Router } from "express";
import { container } from "tsyringe";
import { StoreServices } from "./services";
import { StoreControllers } from "./controllers";
import { ValidateToken } from "../@shared/validToken.middleware";
import { AdmAuth } from "../@shared/admAuth.middleware";

container.registerSingleton("StoreServices", StoreServices);
const storeController = container.resolve(StoreControllers);

export const storeRoutes = Router();

storeRoutes.post("/", (req, res) => storeController.create(req, res));

storeRoutes.get("/", (req, res) => storeController.getMany(req, res));

storeRoutes.get("/:id", (req, res) => storeController.getOne(req, res));

storeRoutes.patch("/:id", ValidateToken.execute, AdmAuth.execute, (req, res) => storeController.update(req, res));

storeRoutes.delete("/:id", ValidateToken.execute, AdmAuth.execute, (req, res) => storeController.delete(req, res));