import { container } from "tsyringe";
import { EmployeeAuthService } from "./services";
import { EmployeeAuthController } from "./controller";
import { Router } from "express";

container.registerSingleton("EmployeeAuthService", EmployeeAuthService);

const employeeAuthController = container.resolve(EmployeeAuthController);

export const employeeAuthRouter = Router();

employeeAuthRouter.get("/", (req, res) => employeeAuthController.login(req, res));

