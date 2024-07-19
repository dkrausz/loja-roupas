import { container } from "tsyringe";
import { OrderServices } from "./services";
import { OrderControllers } from "./controllers";
import { Router } from "express";
import { IsIdExisting } from "./isIdExisting.middleware";

container.registerSingleton("OrderServices", OrderServices);
const orderController = container.resolve(OrderControllers);

export const orderRouter = Router();

orderRouter.post("/", (req, res) => orderController.register(req, res));

orderRouter.get("/", (req, res) => orderController.get(req, res));

orderRouter.use("/:id", IsIdExisting.execute);

orderRouter.get("/:id", (req, res) => orderController.getOrder(req, res));

// Listagem do pedido com todos os produtos
// orderRouter.get("/:id/products", (req, res) => orderController.getOrderProducts(req, res));

orderRouter.patch("/:id", (req, res) => orderController.updateOrder(req, res));

orderRouter.delete("/:id", (req, res) => orderController.deleteOrder(req, res));
