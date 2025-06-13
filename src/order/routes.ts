import { container } from "tsyringe";
import { OrderServices } from "./services";
import { OrderControllers } from "./controllers";
import { Router } from "express";
import { ValidateToken } from "../@shared/validateToken.middleware";
import { ClientAccessPermission } from "../client/middlewares/clientAccessPermission.middleware";
import { OrderIdValid } from "./orderIdValid.middleware";
import { whoHasAccess } from "../@shared/whoHasAccess.middleware";
import { bodyMiddleware } from "../@shared/body.middeware";
import { orderRegisterSchema } from "./schemas";

container.registerSingleton("OrderServices", OrderServices);
const orderController = container.resolve(OrderControllers);

export const orderRouter = Router();

orderRouter.post(
  "/:clientId",
  ValidateToken.execute,
  whoHasAccess.permission("ADM", "employee", "owner"),
  bodyMiddleware.bodyIsValid(orderRegisterSchema),
  orderController.register
);

orderRouter.get("/", ValidateToken.execute, whoHasAccess.permission("ADM"), orderController.get);
// orderRouter.use("/:orderId",ValidateToken.execute, whoHasAccess.permission("ADM") , OrderIdValid.execute);
orderRouter.get("/:orderId", ValidateToken.execute, whoHasAccess.permission("ADM"), orderController.getOrder);

// orderRouter.patch("/:orderId", ValidateToken.execute, whoHasAccess.permission("ADM"), orderController.updateOrder);

orderRouter.delete("/:orderId", ValidateToken.execute, whoHasAccess.permission("ADM"), orderController.deleteOrder);
