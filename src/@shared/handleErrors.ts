import { Request, Response, NextFunction } from "express";
import { AppError } from "./errors";
import { ZodError } from "zod";
import { JsonWebTokenError } from "jsonwebtoken";

export class HandleErrors {
  static execute(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ message: err.message });
    }

    if (err instanceof ZodError) {
      // console.log(err);
      return res.status(400).json({ errors: err.flatten().fieldErrors });
    }

    if (err instanceof JsonWebTokenError) {
      res.status(401).json({ message: err.message });
    }

    return res.status(500).json({ error: "Internal server error." });
  }
}
