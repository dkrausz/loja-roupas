import { NextFunction, Request, Response } from "express";
import { AppError } from "./errors";

class WhoHasAccess{

  public permission=(accessLevel1:string, accessLevel2?:string, accessLevel3?:string)=>
  (req:Request,res:Response,next: NextFunction):void=>{
       const {accessLevel} = res.locals.decode;
       const {sub} = res.locals.decode;
       const {publicId} = req.params;
      console.log(sub);
      console.log(accessLevel);
      
      
          
    if(accessLevel1=== "ADM" || accessLevel2=== "ADM" || accessLevel3 === "ADM"){      
      if(accessLevel =="ADM"){        
       return next();     
      }
      
    } 
    if(accessLevel1=== "employee" || accessLevel2=== "employee" || accessLevel3 === "employee"){     
      if(accessLevel =="FUNCIONARIO"){         
        return next();      
      }
    } 
    if(accessLevel1=== "owner" || accessLevel2=== "owner" || accessLevel3 === "owner"){    
      if(publicId === sub){        
        return next();  
      }      
      
    }   
    
    throw new AppError(403, "You don't have permission to perform this action");

  }

}

export const whoHasAcess = new WhoHasAccess();