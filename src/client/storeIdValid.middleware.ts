import { NextFunction, Request, Response } from "express";
import { prisma } from "../database/prisma";
import { AppError } from "../@shared/errors";

export class StoreIdValid {
  static execute = async (req: Request, _res: Response, next: NextFunction) => {
    const storeIdFound = await prisma.store.findUnique({
      where: { id: req.body.storeId },
    });

    if (!storeIdFound) {
      throw new AppError(404, "Store not found.");
    }

    return next();
  };
}
