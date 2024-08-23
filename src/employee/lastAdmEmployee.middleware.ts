import { AccessLevel } from "@prisma/client"
import { prisma } from "../database/prisma"
import { NextFunction, Request, Response } from "express";
import { AppError } from "../@shared/errors";



class LastAmdEmployee{

  public isTheLastOne=async(req:Request,res:Response,next:NextFunction)=>{  
    
    const lastAdm = await prisma.employee.count({where:{accessLevel: 'ADM'}});
    if(lastAdm===1){
      throw new AppError(403, "You can't delete the only ADM");
    };
    
    next();
  };


};

export const lastAdmEmployee = new LastAmdEmployee();