import { NextFunction, Request, Response } from "express";
import { prisma } from "../database/prisma";
import { AppError } from "../@shared/errors";

export class IsIdExisting {
  static execute = async (_req: Request, res: Response, next: NextFunction) => {
    const clientId: string = res.locals.clientToken;

    const foundClient = await prisma.client.findFirst({
      where: { publicId: clientId },
    });

    if (!foundClient) {
      throw new AppError(404, "Client not found.");
    }

    return next();
  };
}
