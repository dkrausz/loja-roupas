import { NextFunction, Request, Response } from "express";
import { AppError } from "./errors";
import jwt from "jsonwebtoken";

export class ValidateToken {
    static execute(req: Request, res: Response, next: NextFunction) {
        const authorization = req.headers.authorization;

        const token = authorization?.replace("Bearer", "");

        if (!token) {
            throw new AppError(401, "Token is required")
        };

        jwt.verify(token, process.env.JWT_SECRET as string);

        res.locals.decode = jwt.decode(token);

        next();
    }
}