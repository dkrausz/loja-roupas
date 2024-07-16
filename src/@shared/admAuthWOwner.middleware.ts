import { NextFunction, Request, Response } from "express";

export class AdmAuthWOwner {
    static execute(req: Request, res: Response, next: NextFunction) {
        const { decode } = res.locals;

        if (decode && decode.accessLevel === "ADM") {
            next();
        } else {
            next();
        }
    }
};

