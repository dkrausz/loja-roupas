import { container } from "tsyringe";
import { OrderServices } from "./services";
import { OrderControllers } from "./controllers";
import { Router } from "express";

container.registerSingleton("OrderServices", OrderServices);
const orderController = container.resolve(OrderControllers);

export const orderRoutes = Router();

orderRoutes.post("/", (req, res) => orderController.register(req, res));

orderRoutes.get("/", (req, res) => orderController.get(req, res));

orderRoutes.get("/:id", (req, res) => orderController.getOrder(req, res));

orderRoutes.patch("/:id", (req, res) => orderController.updateOrder(req, res));

orderRoutes.delete("/:id", (req, res) => orderController.deleteOrder(req, res));
