import { NextFunction, Request, Response } from "express";
import { prisma } from "../database/prisma";
import { AppError } from "../@shared/errors";

export class ExistingLoginEmail {
  static execute = async (req: Request, res: Response, next: NextFunction) => {
    console.log("middleware");
    const foundEmail = await prisma.client.findUnique({
      where: { email: req.body.email },
    });

    console.log(foundEmail);
    if (!foundEmail) {
      throw new AppError(404, "User not found.");
    }

    return next();
  };
}
