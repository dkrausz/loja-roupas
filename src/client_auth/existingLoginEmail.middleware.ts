import { NextFunction, Request, Response } from "express";
import { prisma } from "../database/prisma";
import { AppError } from "../@shared/errors";

export class ExistingLoginEmail {
  static execute = async (req: Request, res: Response, next: NextFunction) => {
    const foundEmail = await prisma.client.findUnique({
      where: { email: req.body.email },
    });

    if (!foundEmail) {
      throw new AppError(404, "User not found.");
    }

    return next();
  };
}
