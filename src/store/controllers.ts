import { inject, injectable } from "tsyringe";
import { StoreServices } from "./services";
import { Request, Response } from "express";
import { TReturnStore } from "./schemas";

@injectable()
export class StoreControllers {
    constructor(@inject(StoreServices) private storeServices: StoreServices) { }

    async getMany(req: Request, res: Response): Promise<Response<TReturnStore[]>> {
        const response = await this.storeServices.getMany();

        return res.status(200).json(response);
    };

    async getOne(req: Request, res: Response): Promise<Response<TReturnStore | null>>{
        const id = req.params.id;

        const response = await this.storeServices.getOne(Number(id));

        return res.status(200).json(response);
    };

    async create(req: Request, res: Response): Promise<Response<TReturnStore>>{
        const response = await this.storeServices.create(req.body);

        return res.status(201).json(response);
    };

    async update(req: Request, res: Response): Promise<Response<TReturnStore>>{
        const id = req.params.id;

        const response = await this.storeServices.update(Number(id), req.body);

        return res.status(200).json(response);
    };

    async delete(req: Request, res: Response): Promise<Response<void>>{
        const id = req.params.id;

        const response = await this.storeServices.delete(Number(id));

        return res.status(204).json();
    }
}