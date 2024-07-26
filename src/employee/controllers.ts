import { inject, injectable } from "tsyringe";
import { EmployeeServices } from "./services";
import { Request, Response } from "express";
import { TEmployeeReturn } from "./interfaces";

@injectable()
export class EmployeeControllers {
  constructor(@inject(EmployeeServices) private employeeServices: EmployeeServices) {}

  public getMany=async(req: Request, res: Response): Promise<Response<TEmployeeReturn[]>>=> {
    const response = await this.employeeServices.getMany();

    return res.status(200).json(response);
  }

   public getOne=async(req: Request, res: Response): Promise<Response<TEmployeeReturn | null>> =>{
    const { publicId } = req.params;

    const response = await this.employeeServices.getOne(publicId);

    return res.status(200).json(response);
  }

  public create = async (req: Request, res: Response): Promise<Response<TEmployeeReturn>> => {
    const response = await this.employeeServices.create(req.body);

    return res.status(201).json(response);
  };

  public update = async (req: Request, res: Response): Promise<Response<TEmployeeReturn>> => {
    const { publicId } = req.params;

    console.log(publicId);
    console.log(req.body);

    const response = await this.employeeServices.update(publicId, req.body);

    return res.status(200).json(response);
  };

  public delete=async(req: Request, res: Response): Promise<Response<void>>=> {
    const {publicId} = req.params;

    await this.employeeServices.delete(publicId);

    return res.status(204).json();
  }
}
