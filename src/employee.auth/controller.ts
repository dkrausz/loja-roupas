import { autoInjectable, inject } from "tsyringe";
import { EmployeeAuthService } from "./services";
import { Request, Response } from "express";


@autoInjectable()
export class EmployeeAuthController {
    constructor(
        @inject(EmployeeAuthService)
        private employeeAuthService: EmployeeAuthService
    ){}

    async login (req: Request, res: Response): Promise<Response>{
        const response = await this.employeeAuthService.login(req.body);
        
        return res.status(201).json(response);
    }
}