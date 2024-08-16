import { NextFunction, Request, Response } from "express";


class Pagination{

  public handlePagination = (req:Request, res:Response, next: NextFunction)=>{

    const queryPage = Number(req.query.page);
    const queryPerPage = Number(req.query.perPage);
    
    const page = queryPage && queryPage>1? queryPage:1;
    const perPage = queryPerPage && queryPerPage>0 && queryPerPage<40? queryPerPage:10;

            
    const url = `${req.protocol}://${req.headers.host}${req.baseUrl}`
    const previousPage = `${url}?page=${(page-1)<1?page:page-1}&perPage=${perPage}`;
    const nextPage = `${url}?page=lastpage&perPage=${perPage}`;
   
    const pagination={page, perPage,previousPage,nextPage};
    
    res.locals = {...res.locals,pagination};
    
    return next();
  };

  

};

export const pagination = new Pagination();