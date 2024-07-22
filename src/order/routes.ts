import { container } from "tsyringe";
import { OrderServices } from "./services";
import { OrderControllers } from "./controllers";
import { Router } from "express";

container.registerSingleton("OrderServices", OrderServices);
const orderController = container.resolve(OrderControllers);

export const orderRouter = Router();

orderRouter.post("/", (req, res) => orderController.register(req, res));

orderRouter.get("/", (req, res) => orderController.get(req, res));

// Verificar se o id existe
orderRouter.get("/:id", (req, res) => orderController.getOrder(req, res));

// Verificar se o id existe
// Listagem do pedido com todos os produtos
// orderRouter.get("/:id/products", (req, res) => orderController.getOrderProducts(req, res));

// Verificar se o id existe
orderRouter.patch("/:id", (req, res) => orderController.updateOrder(req, res));

// Verificar se o id existe
orderRouter.delete("/:id", (req, res) => orderController.deleteOrder(req, res));
