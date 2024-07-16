import { NextFunction, Request, Response } from "express";
import { prisma } from "../database/prisma";
import { AppError } from "../@shared/errors";

export class IsUniqueCpf {
  static execute = async (req: Request, res: Response, next: NextFunction) => {
    const loadRegisteredUser = await prisma.client.findFirst({
      where: { cpf: req.body.cpf },
    });

    if (loadRegisteredUser) {
      throw new AppError(409, "Cpf already registered.");
    }

    return next();
  };
}
