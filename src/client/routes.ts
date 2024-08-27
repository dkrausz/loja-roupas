import { container, delay } from "tsyringe";
import { ClientServices } from "./services";
import { ClientControllers } from "./controllers";
import { Router } from "express";
import { ValidateToken } from "../@shared/validateToken.middleware";
import { ClientAccessPermission } from "./middlewares/clientAccessPermission.middleware";
import { bodyMiddleware } from "../@shared/body.middeware";
import { clientRegisterSchema, clientUpdateSchema } from "./schemas";
import { Cpf } from "../@shared/cpf.middleware";
import { IsIdExisting } from "./middlewares/isIdExisting.middleware";
import {
  createAddressBodySchema,
  updateAddressBodySchema,
} from "../address/schemas";
import { AddressController } from "../address/controller";
import { whoHasAcess } from "../@shared/whoHasAccess.middleware";
import { AddressService } from "../address/service";
import { IsUniqueEmail } from "./middlewares/isUniqueEmail.middleware";
import { StoreIdValid } from "../@shared/storeIdValid.middleware";
import { AdmAuth } from "../@shared/admAuth.middleware";
import { IsUniqueEmailUpdate } from "./middlewares/isUniqueEmailUpdate.middleware";
container.registerSingleton("ClientServices", ClientServices);
export const clientControllers = container.resolve(ClientControllers);

// container.registerSingleton("AddressServices", AddressService);
// const addressController = container.resolve(AddressController);

export const clientRouter = Router();

clientRouter.post(
  "/",
  bodyMiddleware.bodyIsValid(clientRegisterSchema),
  IsUniqueEmail.execute,
  Cpf.isValid,
  Cpf.isUnique,
  StoreIdValid.execute,
  (req, res) => {
    clientControllers.register(req, res);
  }
);

// Validar token e verificar se é ADM
clientRouter.get("/", ValidateToken.execute, AdmAuth.execute, (req, res) =>
  clientControllers.get(req, res)
);

clientRouter.use("/:id", IsIdExisting.execute);

clientRouter.get(
  "/:id",
  ValidateToken.execute,
  ClientAccessPermission.execute,
  (req, res) => clientControllers.getOne(req, res)
);

clientRouter.patch(
  "/:id",
  IsUniqueEmailUpdate.execute,
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

// clientRouter.post(
//   "/:id/address",
//   ValidateToken.execute,
//   whoHasAcess.permission("owner", "ADM"),
//   bodyMiddleware.bodyIsValid(createAddressBodySchema),
//   // addressController.createAddress
// );

// clientRouter.get(
//   "/:id/address",
//   ValidateToken.execute,
//   whoHasAcess.permission("owner", "ADM"),
//   bodyMiddleware.bodyIsValid(updateAddressBodySchema),
//   addressController.getAddressByUser
// );

// clientRouter.patch(
//   "/:id/address/:addressid",
//   ValidateToken.execute,
//   whoHasAcess.permission("owner", "ADM"),
//   bodyMiddleware.bodyIsValid(updateAddressBodySchema),
//   addressController.updateAddress
// );

// clientRouter.delete(
//   "/:id/address/:addressid",
//   ValidateToken.execute,
//   whoHasAcess.permission("owner", "ADM"),
//   addressController.deleteAddress
// );
