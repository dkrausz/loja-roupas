import { NextFunction, Request, Response } from "express";
import { prisma } from "../database/prisma";
import { AppError } from "../@shared/appError";


export class EmployeeOwner {
    static execute(req: Request, res: Response, next: NextFunction) {
        const { decode } = res.locals;
        const employeeId = req.params.id;

        if (decode && (decode.sub === employeeId || decode.accessLevel === "ADM")) {
            next();
        } else {
            throw new AppError(403, "You don't have permission to perform this action");
        }
    }
}