import { container } from "tsyringe";
import { ClientServices } from "./services";
import { ClientControllers } from "./controllers";
import { Router } from "express";
import { IsUniqueEmail } from "./isUniqueEmail.middleware";
import { IsValidcpf } from "./isValidCpf.middleware";
import { IsUniqueCpf } from "./isUniqueCpf.middleware";
import { ValidateClientToken } from "../@shared/validateClientToken";
import { ClientAccessPermission } from "./clientAccessPermission.middleware";
import { bodyMiddleware } from "../@shared/body.middeware";
import { Schema } from "zod";
import { clientRegisterSchema, clientUpdateSchema } from "./schemas";
import { IsIdExisting } from "./isIdExisting.middleware";

container.registerSingleton("ClientServices", ClientServices);
const clientControllers = container.resolve(ClientControllers);

export const clientRouter = Router();

clientRouter.post(
  "/",
  bodyMiddleware.bodyIsValid(clientRegisterSchema),
  IsUniqueEmail.execute,
  IsValidcpf.execute,
  IsUniqueCpf.execute,
  (req, res) => clientControllers.register(req, res)
);

// Somente o administrador?
clientRouter.get("/", (req, res) => clientControllers.get(req, res));

clientRouter.get(
  "/:id",
  ValidateClientToken.execute,
  IsIdExisting.execute,
  ClientAccessPermission.execute,
  (req, res) => clientControllers.getOne(req, res)
);

clientRouter.patch(
  "/:id",
  bodyMiddleware.bodyIsValid(clientUpdateSchema),
  ValidateClientToken.execute,
  IsIdExisting.execute,
  ClientAccessPermission.execute,
  (req, res) => clientControllers.update(req, res)
);

// O cliente pode ser excluir mesmo???
clientRouter.delete(
  "/:id",
  ValidateClientToken.execute,
  IsIdExisting.execute,
  ClientAccessPermission.execute,
  (req, res) => clientControllers.remove(req, res)
);
