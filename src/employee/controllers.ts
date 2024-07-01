import { inject, injectable } from "tsyringe";
import { EmployeeServices } from "./services";
import { Request, Response } from "express";
import { TEmployeeReturn } from "./schemas";


@injectable()
export class EmployeeControllers {
    constructor(@inject(EmployeeServices) private employeeServices: EmployeeServices){}

    async getMany(req: Request, res: Response): Promise<Response<TEmployeeReturn[]>> {
        const response = await this.employeeServices.getMany();

        return res.status(200).json(response);
    };

    async getOne(req: Request, res: Response): Promise<Response<TEmployeeReturn | null>> {
        const id = req.params.id;

        const response = await this.employeeServices.getOne(Number(id));

        return res.status(200).json(response);
    };

    async create(req: Request, res: Response): Promise<Response<TEmployeeReturn>> {
        const response = await this.employeeServices.create(req.body);

        return res.status(201).json(response);
    };

    async update(req: Request, res: Response): Promise<Response<TEmployeeReturn>> {
        const id = req.params.id;

        const response = await this.employeeServices.update(Number(id), req.body);

        return res.status(200).json(response);
    };

    async delete(req: Request, res: Response): Promise<Response<void>> {
        const id = req.params.id;

        const response = await this.employeeServices.delete(Number(id));

        return res.status(204).json();
    };
};