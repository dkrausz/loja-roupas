import { container } from "tsyringe";
import { EmployeeServices } from "./services";
import { EmployeeControllers } from "./controllers";
import { Router } from "express";


container.registerSingleton("EmployeeServices", EmployeeServices);

const employeeController = container.resolve(EmployeeControllers);

export const employeeRoutes = Router();

employeeRoutes.post("/", (req, res) => employeeController.create(req, res));

employeeRoutes.get("/", (req, res) => employeeController.getMany(req, res));

employeeRoutes.get("/:id", (req, res) => employeeController.getOne(req, res));

employeeRoutes.patch("/:id", (req, res) => employeeController.update(req, res));

employeeRoutes.delete("/:id", (req, res) => employeeController.delete(req, res));
