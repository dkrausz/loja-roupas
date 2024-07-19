import { injectable, inject } from "tsyringe";
import { OrderServices } from "./services";
import { Request, Response } from "express";

@injectable()
export class OrderControllers {
  constructor(@inject("OrderServices") private orderServices: OrderServices) {}

  register = async (req: Request, res: Response): Promise<Response> => {
    const response = await this.orderServices.register(req.body);

    return res.status(201).json(response);
  };

  get = async (_req: Request, res: Response): Promise<Response> => {
    const response = await this.orderServices.get();

    return res.status(200).json(response);
  };

  getOrder = async (req: Request, res: Response): Promise<Response> => {
    const response = await this.orderServices.getOrder(req.params.id);

    return res.status(200).json(response);
  };

  // getOrderProducts = async (req: Request, res: Response): Promise<Response> => {
  //   const response = await this.orderServices.ge;
  // }

  updateOrder = async (req: Request, res: Response): Promise<Response> => {
    const response = await this.orderServices.updateOrder(
      req.params.id,
      req.body
    );

    return res.status(200).json(response);
  };

  deleteOrder = async (req: Request, res: Response): Promise<Response> => {
    await this.orderServices.deleteOrder(req.params.id);

    return res.status(204).json();
  };
}
