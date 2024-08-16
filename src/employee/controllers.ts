import { inject, injectable } from "tsyringe";
import { EmployeeServices } from "./services";
import { Request, Response } from "express";
import { TEmployeeReturn } from "./interfaces";

@injectable()
export class EmployeeControllers {
  constructor(@inject(EmployeeServices) private employeeServices: EmployeeServices) {}

  public getMany = async (req: Request, res: Response): Promise<Response<TEmployeeReturn[]>> => {
    const response = await this.employeeServices.getMany();

    return res.status(200).json(response);
  };

  public getOne = async (req: Request, res: Response): Promise<Response<TEmployeeReturn | null>> => {
    const { id } = req.params;

    const response = await this.employeeServices.getOne(id);

    return res.status(200).json(response);
  };

  public create = async (req: Request, res: Response): Promise<Response<TEmployeeReturn>> => {
    const response = await this.employeeServices.create(req.body);

    return res.status(201).json(response);
  };

  public update = async (req: Request, res: Response): Promise<Response<TEmployeeReturn>> => {
    const { id } = req.params;

    const response = await this.employeeServices.update(id, req.body);

    return res.status(200).json(response);
  };

  public delete = async (req: Request, res: Response): Promise<Response<void>> => {
    const { id } = req.params;

    await this.employeeServices.delete(id);

    return res.status(204).json();
  };

  public login = async (req: Request, res: Response): Promise<Response> => {
    const response = await this.employeeServices.login(req.body);

    return res.status(200).json(response);
  };
}
