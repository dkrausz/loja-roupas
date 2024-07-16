import { container } from "tsyringe";
import { ClientServices } from "./services";
import { ClientControllers } from "./controllers";
import { Router } from "express";
import { IsUniqueEmail } from "./isUniqueEmail.middleware";
import { IsValidcpf } from "./isValidCpf.middleware";
import { IsUniqueCpf } from "./isUniqueCpf.middleware";
import { ValidateClientToken } from "../@shared/validateClientToken";

container.registerSingleton("ClientServices", ClientServices);
const clientControllers = container.resolve(ClientControllers);

export const clientRouter = Router();

clientRouter.post(
  "/",
  IsUniqueEmail.execute,
  IsValidcpf.execute,
  IsUniqueCpf.execute,
  (req, res) => clientControllers.register(req, res)
);

// Somente o administrador?
clientRouter.get("/", (req, res) => clientControllers.get(req, res));

clientRouter.get("/:id", ValidateClientToken.execute, (req, res) =>
  clientControllers.getOne(req, res)
);

clientRouter.patch("/:id", ValidateClientToken.execute, (req, res) =>
  clientControllers.update(req, res)
);

clientRouter.delete("/:id", ValidateClientToken.execute, (req, res) =>
  clientControllers.remove(req, res)
);
