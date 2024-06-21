import { container } from "tsyringe";
import { ClientServices } from "./services";
import { ClientControllers } from "./controllers";
import { Router } from "express";

container.registerSingleton("ClientServices", ClientServices);
const clientControllers = container.resolve(ClientControllers);

export const clientRouter = Router();

clientRouter.post("/", (req, res) => clientControllers.register(req, res));

clientRouter.get("/", (req, res) => clientControllers.get(req, res));

clientRouter.get("/:id", (req, res) => clientControllers.getOne(req, res));

clientRouter.patch("/:id", (req, res) => clientControllers.update(req, res));

clientRouter.delete("/:id", (req, res) => clientControllers.remove(req, res));
