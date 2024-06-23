import {z} from "zod";
import { addressSchema, createBodySchema, updateBodySchema } from "./schemas";

type TCreateAddressBody = z.infer<typeof createBodySchema>;
type TReturnAddress = z.infer<typeof addressSchema>;
type TUpdateAddressBody = z.infer<typeof updateBodySchema>;


interface IAddressService{
  create(payload:TCreateAddressBody):Promise<TReturnAddress>;
  getAddressById(id:number):Promise<TReturnAddress>;
  getAddressByUser(clientId:number):Promise<Array<TReturnAddress>>;

}

export{TCreateAddressBody,TReturnAddress,IAddressService,TUpdateAddressBody};