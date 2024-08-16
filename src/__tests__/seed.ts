import supertest from "supertest";
import { app } from "../app";



class seed{

  
public createClients=async(qty:number)=>{
  const request = supertest(app);

  
  const response = await request.post("/clients").send
  
  return
}


}