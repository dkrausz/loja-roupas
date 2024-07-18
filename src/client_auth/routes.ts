import { container } from "tsyringe";
import { ClientAuthenticationService } from "./services";
import { ClientAuthenticationController } from "./controllers";
import { Router } from "express";
import { ExistingLoginEmail } from "./existingLoginEmail.middleware";

container.registerSingleton(
  "ClientAuthenticationService",
  ClientAuthenticationService
);

const clientAuthenticationController = container.resolve(
  ClientAuthenticationController
);

export const clientAuthenticationRouter = Router();

clientAuthenticationRouter.get("/", ExistingLoginEmail.execute, (req, res) =>
  clientAuthenticationController.login(req, res)
);
