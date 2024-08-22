import { container } from "tsyringe";
import { EmployeeServices } from "./services";
import { EmployeeControllers } from "./controllers";
import { Router } from "express";
import { ValidateToken } from "../@shared/validateToken.middleware";
import { bodyMiddleware } from "../@shared/body.middeware";
import { createEmployeeSchema, employeeLogin, updateEmployeeSchema } from "./schemas";
import { Cpf } from "../@shared/cpf.middleware";
import { whoHasAcess } from "../@shared/whoHasAccess.middleware";
import { isUniqueEmail } from "../@shared/isUniqueEmail.middleware";
import { StoreIdValid } from "../@shared/storeIdValid.middleware";


container.registerSingleton("EmployeeServices", EmployeeServices);
const employeeController = container.resolve(EmployeeControllers);


export const employeeRoutes = Router();

employeeRoutes.post("/",StoreIdValid.execute ,ValidateToken.execute, whoHasAcess.permission("ADM"),isUniqueEmail.employee,Cpf.isValid,Cpf.isUniqueEmployee, bodyMiddleware.bodyIsValid(createEmployeeSchema),employeeController.create);

// employeeRoutes.post("/", bodyMiddleware.bodyIsValid(createEmployeeSchema), (req, res) => employeeController.create(req, res));

employeeRoutes.get("/", ValidateToken.execute, whoHasAcess.permission("ADM"),employeeController.getMany);

employeeRoutes.get("/:id", ValidateToken.execute, whoHasAcess.permission("ADM","owner"),employeeController.getOne);

employeeRoutes.patch("/:id", ValidateToken.execute, whoHasAcess.permission("ADM","owner"), bodyMiddleware.bodyIsValid(updateEmployeeSchema), employeeController.update);

employeeRoutes.delete("/:id", ValidateToken.execute, whoHasAcess.permission("ADM"), employeeController.delete);

employeeRoutes.post("/login",bodyMiddleware.bodyIsValid(employeeLogin),employeeController.login)


