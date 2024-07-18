import { NextFunction, Request, Response } from "express";
import { AppError } from "../@shared/errors";

export class ClientAccessPermission {
  static execute = (req: Request, res: Response, next: NextFunction) => {
    const token = res.locals.decode;

    const authorized = token === req.params.id;

    if (!authorized) {
      throw new AppError(401, "Unauthorized.");
    }

    return next();
  };
}
