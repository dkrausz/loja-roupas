import { container } from "tsyringe";
import { EmployeeServices } from "./services";
import { EmployeeControllers } from "./controllers";
import { Router } from "express";
import { ValidateToken } from "../@shared/validateToken.middleware";
import { bodyMiddleware } from "../@shared/body.middeware";
import { createEmployeeSchema, updateEmployeeSchema } from "./schemas";
import { Cpf } from "../@shared/cpf.middleware";
import { whoHasAcess } from "../@shared/whoHasAccess.middleware";


container.registerSingleton("EmployeeServices", EmployeeServices);

const employeeController = container.resolve(EmployeeControllers);

export const employeeRoutes = Router();

employeeRoutes.post("/", ValidateToken.execute, whoHasAcess.permission("ADM"),Cpf.isValid,Cpf.isUniqueEmployee, bodyMiddleware.bodyIsValid(createEmployeeSchema),employeeController.create);

// employeeRoutes.post("/", bodyMiddleware.bodyIsValid(createEmployeeSchema), (req, res) => employeeController.create(req, res));

employeeRoutes.get("/", ValidateToken.execute, whoHasAcess.permission("ADM"),employeeController.getMany);

employeeRoutes.get("/:publicId", ValidateToken.execute, whoHasAcess.permission("ADM","owner"),employeeController.getOne);

employeeRoutes.patch("/:publicId", ValidateToken.execute, whoHasAcess.permission("ADM","owner"), bodyMiddleware.bodyIsValid(updateEmployeeSchema), employeeController.update);

employeeRoutes.delete("/:publicId", ValidateToken.execute, whoHasAcess.permission("ADM"), employeeController.delete);


