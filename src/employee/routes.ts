import { container } from "tsyringe";
import { EmployeeServices } from "./services";
import { EmployeeControllers } from "./controllers";
import { Router } from "express";
import { AdmAuthWOwner } from "../@shared/admAuthWOwner.middleware";
import { ValidateToken } from "../@shared/validToken.middleware";
import { EmployeeOwner } from "./employeeOwner.middleware";
import { AdmAuth } from "../@shared/admAuth.middleware";
import { bodyMiddleware } from "../@shared/body.middeware";
import { createEmployeeSchema } from "./schemas";
import { updateBodySchema } from "../address/schemas";



container.registerSingleton("EmployeeServices", EmployeeServices);

const employeeController = container.resolve(EmployeeControllers);

export const employeeRoutes = Router();

employeeRoutes.post("/", ValidateToken.execute, AdmAuth.execute, bodyMiddleware.bodyIsValid(createEmployeeSchema), (req, res) => employeeController.create(req, res));

employeeRoutes.get("/", ValidateToken.execute, AdmAuth.execute,(req, res) => employeeController.getMany(req, res));

employeeRoutes.get("/:id", ValidateToken.execute, AdmAuth.execute, EmployeeOwner.execute, (req, res) => employeeController.getOne(req, res));

employeeRoutes.patch("/:id", ValidateToken.execute, AdmAuthWOwner.execute, EmployeeOwner.execute, bodyMiddleware.bodyIsValid(updateBodySchema), (req, res) => employeeController.update(req, res));

employeeRoutes.delete("/:id", ValidateToken.execute, AdmAuth.execute, (req, res) => employeeController.delete(req, res));
