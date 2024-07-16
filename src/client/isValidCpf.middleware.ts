import { NextFunction, Request, Response } from "express";

export class IsValidcpf {
  static execute = (req: Request, res: Response, next: NextFunction) => {
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
      throw new Error("Client cpf is not valid.");
    }

    return next();
  };
}
