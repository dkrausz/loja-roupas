import supertest from "supertest"
import { app } from "../../app"
import { Factory } from "../factory";


describe("Create client test",()=>{

  const request = supertest(app);



test("Should be able to create 20 clients",async()=>{
const factory = new Factory();

  for(let i=0;i<20;i++){
    const newClient = factory.clientFactory();
        
    const response = await request.post("/clients").send(newClient);
    
     expect(response.statusCode).toBe(201);

  }


});

});