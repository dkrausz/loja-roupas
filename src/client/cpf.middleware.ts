import { NextFunction, Request, Response } from "express";
import { prisma } from "../database/prisma";
import { AppError } from "../@shared/errors";

export class Cpf {
  static isUnique = async (req: Request, res: Response, next: NextFunction) => {
    const loadRegisteredUser = await prisma.client.findFirst({
      where: { cpf: req.body.cpf },
    });

    if (loadRegisteredUser) {
      throw new AppError(409, "Cpf already registered.");
    }

    return next();
  };

  static isValid = (req: Request, res: Response, next: NextFunction) => {
    const cpf = req.body.cpf;
    let sum: number = 0;
    for (let i: number = 2; i <= 10; i++) {
      sum += Number(cpf[10 - i]) * i;
    }
    const checkSum1 = (sum * 10) % 11 === Number(cpf[9]);

    sum = 0;
    for (let i: number = 2; i <= 11; i++) {
      sum += Number(cpf[11 - i]) * i;
    }
    const checkSum2 = (sum * 10) % 11 === Number(cpf[10]);

    const validCpf = checkSum1 && checkSum2;
    if (!validCpf) {
      throw new AppError(417, "Client cpf is not valid.");
    }

    return next();
  };
}
