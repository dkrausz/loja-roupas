import { NextFunction, Request, Response } from "express";
import { prisma } from "../database/prisma";
import { AppError } from "./errors";

 class IsUniqueEmail {
  public client = async (req: Request, res: Response, next: NextFunction) => {
    const loadRegisteredUser = await prisma.client.findFirst({
      where: { email: req.body.email },
    });

    if (loadRegisteredUser) {
      throw new AppError(409, "Registered email.");
    }

    return next();
  };

  public employee = async (req: Request, res: Response, next: NextFunction) => {
    const loadRegisteredUser = await prisma.employee.findFirst({
      where: { email: req.body.email },
    });

    if (loadRegisteredUser) {
      throw new AppError(409, "Registered email.");
    }

    return next();
  };


}

export const isUniqueEmail = new IsUniqueEmail();
