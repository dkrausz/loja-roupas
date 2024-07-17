import { NextFunction, Request, Response } from "express";
import { prisma } from "../database/prisma";
import { AppError } from "../@shared/errors";

export class IsIdExisting {
  static execute = async (req: Request, res: Response, next: NextFunction) => {
    const orderIdFound = await prisma.order.findFirst({
      where: { publicId: req.params.id },
    });

    if (!orderIdFound) {
      throw new AppError(404, "Order not found.");
    }

    return next();
  };
}
