import { NextFunction, Request, Response } from "express";
import { AppError } from "./appError";


export class AdmAuth {
    static execute(req: Request, res: Response, next: NextFunction) {
        const { decode } = res.locals;


        if (!decode || decode.accessLevel !== "ADM" || "FUNCIONARIO") {
            throw new AppError(403, "You don't have permission to perform this action");
        }

        next();
    }
}
