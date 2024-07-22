import { container } from "tsyringe";
import { EmployeeServices } from "./services";
import { EmployeeControllers } from "./controllers";
import { Router } from "express";
import { ValidateToken } from "../@shared/validateToken.middleware";
import { EmployeeOwner } from "./employeeOwner.middleware";
import { AdmAuth } from "../@shared/admAuth.middleware";
import { bodyMiddleware } from "../@shared/body.middeware";
import { createEmployeeSchema } from "./schemas";
import { updateAddressBodySchema } from "../address/schemas";



container.registerSingleton("EmployeeServices", EmployeeServices);

const employeeController = container.resolve(EmployeeControllers);

export const employeeRoutes = Router();

// employeeRoutes.post("/", ValidateToken.execute, AdmAuth.execute, bodyMiddleware.bodyIsValid(createEmployeeSchema), (req, res) => employeeController.create(req, res));
employeeRoutes.post("/", bodyMiddleware.bodyIsValid(createEmployeeSchema), (req, res) => employeeController.create(req, res));

employeeRoutes.get("/", ValidateToken.execute, AdmAuth.execute,(req, res) => employeeController.getMany(req, res));

employeeRoutes.get("/:id", ValidateToken.execute, EmployeeOwner.execute, (req, res) => employeeController.getOne(req, res));

employeeRoutes.patch("/:id", ValidateToken.execute, EmployeeOwner.execute, bodyMiddleware.bodyIsValid(updateAddressBodySchema), (req, res) => employeeController.update(req, res));

employeeRoutes.delete("/:id", ValidateToken.execute, AdmAuth.execute, (req, res) => employeeController.delete(req, res));


