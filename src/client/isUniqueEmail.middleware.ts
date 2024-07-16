import { NextFunction, Request, Response } from "express";
import { prisma } from "../database/prisma";

export class IsUniqueEmail {
  static execute = async (req: Request, res: Response, next: NextFunction) => {
    const loadRegisteredUser = await prisma.client.findFirst({
      where: { email: req.body.email },
    });

    if (loadRegisteredUser) {
      throw new Error("Registered email.");
    }

    return next();
  };
}
