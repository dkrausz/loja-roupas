import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { ClientServices } from "./services";

@injectable()
export class ClientControllers {
  constructor(@inject(ClientServices) private clientServices: ClientServices) {}

  register = async (req: Request, res: Response): Promise<Response> => {
    const response = await this.clientServices.register(req.body);

    return res.status(201).json(response);
  };

  get = async (_req: Request, res: Response): Promise<Response> => {
    const response = await this.clientServices.get();

    return res.status(200).json(response);
  };

  getOne = async (req: Request, res: Response): Promise<Response> => {
    const response = await this.clientServices.getOne(req.params.id);

    return res.status(200).json(response);
  };

  update = async (req: Request, res: Response): Promise<Response> => {
    const response = await this.clientServices.update(req.params.id, req.body);

    return res.status(200).json(response);
  };

  remove = async (req: Request, res: Response): Promise<Response> => {
    await this.clientServices.remove(req.params.id);

    return res.status(204).json();
  };
}
