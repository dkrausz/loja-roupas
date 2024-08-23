import { NextFunction, Request, Response } from "express";
import { jwtConfig } from "../configs/auth.config";
import { verify } from "jsonwebtoken";
import { prisma } from "../database/prisma";
import { AppError } from "../@shared/errors";

 class ValidateToken {
  public valid=async(req: Request, res: Response, next: NextFunction)=> {

    const existEmployee = await prisma.employee.count();
        
        
    if(existEmployee<=0){  
      const accessLevel = 'ADM';
      res.locals.decode = {accessLevel};          
      req.body.accessLevel='ADM';
     return next();      
    }

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

export const validToken = new ValidateToken();
