import { NextFunction, Request, Response } from "express";
import { AppError } from "./errors";
import { jwtConfig } from "../configs/auth.config";
import { verify } from "jsonwebtoken";

export class ValidateToken {
  static execute(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new AppError(401, "Token is required.");
    }

    const [_prefix, token] = authorization?.split(" ");
    const { jwtKey } = jwtConfig();
    const tokenDecoded = verify(token, jwtKey);
    
    res.locals.decode = tokenDecoded;
    res.locals.clientToken = tokenDecoded.sub;

    return next();
  }
}
