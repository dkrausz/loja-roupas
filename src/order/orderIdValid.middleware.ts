import { NextFunction, Request, Response } from "express";
import { prisma } from "../database/prisma";
import { AppError } from "../@shared/errors";

export class OrderIdValid {
  static execute = async (req: Request, _res: Response, next: NextFunction) => {
    const existingOrder = await prisma.order.findFirst({
      where: { publicId: req.params.orderId },
    });

    if (!existingOrder) {
      throw new AppError(404, "Order not found.");
    }

    return next();
  };
}
