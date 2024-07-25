import { container } from "tsyringe";
import { EmployeeServices } from "./services";
import { EmployeeControllers } from "./controllers";
import { Router } from "express";
import { ValidateToken } from "../@shared/validateToken.middleware";
import { EmployeeOwner } from "./employeeOwner.middleware";
import { AdmAuth } from "../@shared/admAuth.middleware";
import { bodyMiddleware } from "../@shared/body.middeware";
import { createEmployeeSchema, updateEmployeeSchema } from "./schemas";
import { updateAddressBodySchema } from "../address/schemas";
import { Cpf } from "../@shared/cpf.middleware";



container.registerSingleton("EmployeeServices", EmployeeServices);

const employeeController = container.resolve(EmployeeControllers);

export const employeeRoutes = Router();

// employeeRoutes.post("/", ValidateToken.execute, AdmAuth.execute,Cpf.isValid,Cpf.isUniqueEmployee, bodyMiddleware.bodyIsValid(createEmployeeSchema),employeeController.create);
employeeRoutes.post("/", bodyMiddleware.bodyIsValid(createEmployeeSchema), (req, res) => employeeController.create(req, res));

employeeRoutes.get("/", ValidateToken.execute, AdmAuth.execute,employeeController.getMany);

employeeRoutes.get("/:publicId", ValidateToken.execute, EmployeeOwner.execute,employeeController.getOne);

employeeRoutes.patch("/:publicId", ValidateToken.execute, EmployeeOwner.execute, bodyMiddleware.bodyIsValid(updateEmployeeSchema), employeeController.update);

employeeRoutes.delete("/:publicId", ValidateToken.execute, AdmAuth.execute, employeeController.delete);


