import { NextFunction, Request, Response } from "express";
import { prisma } from "../../database/prisma";
import { AppError } from "../../@shared/errors";

export class IsUniqueEmailUpdate {
  static execute = async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.email) {
      const loadRegisteredUser = await prisma.client.findFirst({
        where: { email: req.body.email },
      });

      if (loadRegisteredUser) {
        throw new AppError(409, "Registered email.");
      }
    }

    return next();
  };
}
