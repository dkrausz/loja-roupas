import { container } from "tsyringe";
import { ClientServices } from "./services";
import { ClientControllers } from "./controllers";
import { Router } from "express";
import { IsUniqueEmail } from "./middlewares/isUniqueEmail.middleware";
import { ValidateToken } from "../@shared/validateToken.middleware";
import { ClientAccessPermission } from "./middlewares/clientAccessPermission.middleware";
import { bodyMiddleware } from "../@shared/body.middeware";
import { clientRegisterSchema, clientUpdateSchema } from "./schemas";
import { StoreIdValid } from "./middlewares/storeIdValid.middleware";
import { Cpf } from "../@shared/cpf.middleware";
import { IsIdExisting } from "./middlewares/isIdExisting.middleware";
import {createAddressBodySchema,updateAddressBodySchema} from "../address/schemas";
import { AddressController } from "../address/controller";
import { whoHasAcess } from "../@shared/whoHasAccess.middleware";

container.registerSingleton("ClientServices", ClientServices);
const clientControllers = container.resolve(ClientControllers);
const addressController = container.resolve(AddressController);

export const clientRouter = Router();

clientRouter.post(
  "/",
  bodyMiddleware.bodyIsValid(clientRegisterSchema),
  IsUniqueEmail.execute,
  Cpf.isValid,
  Cpf.isUnique,
  StoreIdValid.execute,
  (req, res) => {
    console.log("executando a rota");
    clientControllers.register(req, res);
  }
);

// Somente o administrador?
clientRouter.get("/", (req, res) => clientControllers.get(req, res));

clientRouter.use("/:id", IsIdExisting.execute);

clientRouter.get(
  "/:id",
  ValidateToken.execute,
  ClientAccessPermission.execute,
  (req, res) => clientControllers.getOne(req, res)
);

clientRouter.patch(
  "/:id",
  bodyMiddleware.bodyIsValid(clientUpdateSchema),
  ValidateToken.execute,
  ClientAccessPermission.execute,
  (req, res) => clientControllers.update(req, res)
);

// O cliente pode ser excluir mesmo???
clientRouter.delete(
  "/:id",
  ValidateToken.execute,
  ClientAccessPermission.execute,
  (req, res) => clientControllers.remove(req, res)
);

clientRouter.post("/:id/address", ValidateToken.execute, whoHasAcess.permission("owner", "ADM"),
  bodyMiddleware.bodyIsValid(createAddressBodySchema), addressController.createAddress);

clientRouter.get(
  "/:id/address",
  ValidateToken.execute,
  whoHasAcess.permission("owner", "ADM"),
  bodyMiddleware.bodyIsValid(updateAddressBodySchema),
  addressController.getAddressByUser
);

clientRouter.patch(
  "/:id/address/:addressid",
  ValidateToken.execute,
  whoHasAcess.permission("owner", "ADM"),
  bodyMiddleware.bodyIsValid(updateAddressBodySchema),
  addressController.updateAddress
);

clientRouter.delete(
  "/:id/address/:addressid",
  ValidateToken.execute,
  whoHasAcess.permission("owner", "ADM"),
  addressController.deleteAddress
);
