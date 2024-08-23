import { container } from "tsyringe";
import { EmployeeServices } from "./services";
import { EmployeeControllers } from "./controllers";
import { Router } from "express";
import { bodyMiddleware } from "../@shared/body.middeware";
import {createEmployeeSchema,employeeLogin,updateEmployeeSchema,} from "./schemas";
import { Cpf } from "../@shared/cpf.middleware";
import { whoHasAccess } from "../@shared/whoHasAccess.middleware";
import { isUniqueEmail } from "../@shared/isUniqueEmail.middleware";
import { StoreIdValid } from "../@shared/storeIdValid.middleware";
import { validToken } from "./validateTokenEmployee.middleware";
import { lastAdmEmployee } from "./lastAdmEmployee.middleware";

container.registerSingleton("EmployeeServices", EmployeeServices);
const employeeController = container.resolve(EmployeeControllers);


export const employeeRoutes = Router();

employeeRoutes.post("/",StoreIdValid.execute ,validToken.valid, whoHasAccess.permission("ADM"),isUniqueEmail.employee,Cpf.isValid,Cpf.isUniqueEmployee, bodyMiddleware.bodyIsValid(createEmployeeSchema),employeeController.create);
employeeRoutes.get("/", validToken.valid, whoHasAccess.permission("ADM"),employeeController.getMany);
employeeRoutes.get("/:id", validToken.valid, whoHasAccess.permission("ADM","owner"),employeeController.getOne);
employeeRoutes.patch("/:id", validToken.valid, whoHasAccess.permission("ADM","owner"), bodyMiddleware.bodyIsValid(updateEmployeeSchema), employeeController.update);
employeeRoutes.patch("/:id", validToken.valid, whoHasAccess.permission("ADM", "owner"), bodyMiddleware.bodyIsValid(updateEmployeeSchema), employeeController.update);
employeeRoutes.delete("/:id",  validToken.valid,whoHasAccess.permission("ADM"),lastAdmEmployee.isTheLastOne ,employeeController.delete);
employeeRoutes.post( "/login",bodyMiddleware.bodyIsValid(employeeLogin),employeeController.login);
