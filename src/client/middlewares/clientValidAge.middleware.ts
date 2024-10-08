import { NextFunction, Request, Response } from "express";
import { AppError } from "../../@shared/errors";

export class clientValidAge {
  static execute = (req: Request, res: Response, next: NextFunction) => {
    const nowDate = new Date();
    const minAge = nowDate.setFullYear(
      nowDate.getFullYear() - 18,
      nowDate.getMonth(),
      nowDate.getDay()
    );
    const clientBDate = req.body.birthDate;

    const minValidAge = clientBDate >= minAge;

    if (!minValidAge) {
      throw new AppError(417, "Client has not sufficient age to register.");
    }

    next();
  };
}
