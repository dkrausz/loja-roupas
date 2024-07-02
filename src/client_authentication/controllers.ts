import { Request, Response } from "express";
import { autoInjectable, inject } from "tsyringe";
import { ClientAuthenticationService } from "./services";

@autoInjectable()
export class ClientAuthenticationController {
  constructor(
    @inject(ClientAuthenticationService)
    private clientAuthenticationService: ClientAuthenticationService
  ) {}

  login = async (req: Request, res: Response): Promise<Response> => {
    const response = this.clientAuthenticationService.login(req.body);

    return res.status(201).json(response);
  };
}
