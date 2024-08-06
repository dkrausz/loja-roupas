import { NextFunction, Request, Response } from "express";
import { prisma } from "../database/prisma";
import { AppError } from "../@shared/errors";

export class Cpf {
  static isUnique = async (req: Request, res: Response, next: NextFunction) => {    
    const loadRegisteredUser = await prisma.client.findFirst({
      where: { CPF: req.body.CPF },
    });

    if (loadRegisteredUser) {
      throw new AppError(409, "Cpf already registered.");
    }

    return next();
  };

  static isUniqueEmployee = async (req: Request, res: Response, next: NextFunction) => {
    const employee = await prisma.employee.findFirst({
      where: { CPF: req.body.CPF },
    });

    if (employee) {
      throw new AppError(409, "Cpf already registered.");
    }

    return next();
  };

  static isValid = (req: Request, res: Response, next: NextFunction) => {    
    const cpf = req.body.CPF;
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
      console.log( req.body.CPF);
      
      throw new AppError(417, "Cpf is not valid.");
    }

    return next();
  };
}
