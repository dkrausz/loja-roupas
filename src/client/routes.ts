import { container } from "tsyringe";
import { ClientServices } from "./services";
import { ClientControllers } from "./controllers";
import { Router } from "express";
import { IsUniqueEmail } from "./isUniqueEmail.middleware";
import { ValidateToken } from "../@shared/validateToken.middleware";
import { ClientAccessPermission } from "./clientAccessPermission.middleware";
import { bodyMiddleware } from "../@shared/body.middeware";
import { clientRegisterSchema, clientUpdateSchema } from "./schemas";
import { StoreIdValid } from "./storeIdValid.middleware";
import { Cpf } from "./cpf.middleware";
import { IsIdExisting } from "./isIdExisting.middleware";
import { createAddressBodySchema } from "../address/schemas";
import { AddressController } from "../address/controller";

container.registerSingleton("ClientServices", ClientServices);
const clientControllers = container.resolve(ClientControllers);
const addressController = container.resolve(AddressController);

export const clientRouter = Router();

clientRouter.post("/",bodyMiddleware.bodyIsValid(clientRegisterSchema),IsUniqueEmail.execute,Cpf.isValid,
  Cpf.isUnique, StoreIdValid.execute,(req, res) => clientControllers.register(req, res));

// Somente o administrador?
clientRouter.get("/", (req, res) => clientControllers.get(req, res));

clientRouter.use("/:id", IsIdExisting.execute);

clientRouter.get("/:id", ValidateToken.execute, ClientAccessPermission.execute, (req, res) =>clientControllers.getOne(req, res));

clientRouter.patch("/:id", bodyMiddleware.bodyIsValid(clientUpdateSchema), ValidateToken.execute,
  ClientAccessPermission.execute,(req, res) => clientControllers.update(req, res));

// O cliente pode ser excluir mesmo???
clientRouter.delete("/:id", ValidateToken.execute, ClientAccessPermission.execute, (req, res) =>clientControllers.remove(req, res));

clientRouter.post("/:id/address",ValidateToken.execute, ClientAccessPermission.execute,bodyMiddleware.bodyIsValid(createAddressBodySchema),addressController.createAddress);

// clientRouter.patch("/:clientid/address/id",ValidateToken.execute, ClientAccessPermission.execute,bodyMiddleware.bodyIsValid(createAddressBodySchema),addressController.createAddress);

// clientRouter.delete("/:clientid/address/id",ValidateToken.execute, ClientAccessPermission.execute,bodyMiddleware.bodyIsValid(createAddressBodySchema),addressController.createAddress);

