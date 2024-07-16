import { NextFunction, Request, Response } from "express";
import { AppError } from "./errors";
import { jwtConfig } from "../configs/auth.config";
import { verify } from "jsonwebtoken";

export class ValidateClientToken {
  static execute(req: Request, res: Response, next: NextFunction) {
    const userToken = req.headers.authorization;

    if (!userToken) {
      throw new AppError(401, "Token is required");
    }

    const [_prefix, token] = userToken?.split(" ");
    const { jwtKey } = jwtConfig();
    const tokenDecoded = verify(token, jwtKey);
    res.locals.userId = tokenDecoded.sub;

    return next();
  }
}
