import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

class BodyMiddleware {
  public bodyIsValid =
    (schema: ZodSchema) =>
    (req: Request, _res: Response, next: NextFunction): void => {
      req.body = schema.parse(req.body);
      return next();
    };
}

export const bodyMiddleware = new BodyMiddleware();
