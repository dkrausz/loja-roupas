import { NextFunction, Request, Response } from "express";
import { prisma } from "../database/prisma";
import { AppError } from "./errors";
import { loadedStore } from "../app";

export class StoreIdValid {
  static execute = async (
    _req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    const storeIdFound = await prisma.store.findUnique({
      where: { id: loadedStore.id },
    });

    if (!storeIdFound) {
      throw new AppError(404, "Store not found.");
    }

    return next();
  };
}
