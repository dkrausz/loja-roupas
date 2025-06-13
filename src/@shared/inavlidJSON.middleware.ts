import { NextFunction, Request, Response } from "express";

export class InvalidJson {
  static execute(err: any, req: Request, res: Response, next: NextFunction) {
    if (err.type === "entity.parse.failed") {
      return res.status(400).json({ message: "JSON inválido no corpo da requisição." });
    }
  }
}
