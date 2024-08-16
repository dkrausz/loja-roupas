import { container } from "tsyringe";
import { OrderServices } from "./services";
import { OrderControllers } from "./controllers";
import { Router } from "express";
import { ValidateToken } from "../@shared/validateToken.middleware";
import { ClientAccessPermission } from "../client/middlewares/clientAccessPermission.middleware";
import { OrderIdValid } from "./orderIdValid.middleware";

container.registerSingleton("OrderServices", OrderServices);
const orderController = container.resolve(OrderControllers);

export const orderRouter = Router();

orderRouter.post(
  "/",
  ValidateToken.execute,
  //   ClientAccessPermission.execute,
  (req, res) => orderController.register(req, res)
);

// Precisa de autorização? Só admin?
orderRouter.get("/", (req, res) => orderController.get(req, res));

orderRouter.use("/:orderId", OrderIdValid.execute);

// Verificar se o id existe
orderRouter.get("/:orderId", (req, res) => orderController.getOrder(req, res));

// Verificar se o id existe
// Listagem do pedido com todos os produtos
// orderRouter.get("/:id/products", (req, res) =>
//   orderController.getOrder(req, res)
// );

// Verificar se o id existe
orderRouter.patch("/:orderId", (req, res) =>
  orderController.updateOrder(req, res)
);

// Verificar se o id existe
orderRouter.delete("/:orderId", (req, res) =>
  orderController.deleteOrder(req, res)
);
