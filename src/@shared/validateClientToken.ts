import { NextFunction, Request, Response } from "express";
import { AppError } from "./errors";
import { jwtConfig } from "../configs/auth.config";
import { verify } from "jsonwebtoken";

export class ValidateClientToken {
  static execute(req: Request, res: Response, next: NextFunction) {
    const clientToken = req.headers.authorization;

    if (!clientToken) {
      throw new AppError(401, "Token is required.");
    }

    const [_prefix, token] = clientToken?.split(" ");
    const { jwtKey } = jwtConfig();
    const tokenDecoded = verify(token, jwtKey);
    res.locals.clientToken = tokenDecoded.sub;

    return next();
  }
}
