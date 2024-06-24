import {z} from "zod";
import { addressSchema, createBodySchema, updateBodySchema } from "./schemas";

type TCreateAddressBody = z.infer<typeof createBodySchema>;
type TReturnAddress = z.infer<typeof addressSchema>;
type TUpdateAddressBody = z.infer<typeof updateBodySchema>;


interface IAddressService{
  createAddress(payload:TCreateAddressBody):Promise<TReturnAddress>;
  getAddressById(id:number):Promise<TReturnAddress>;
  getAddressByUser(clientId:number):Promise<Array<TReturnAddress>>;
  updateAddress(payload:TUpdateAddressBody, id:Number):Promise<TReturnAddress>;
  deleteAddress(id:Number):Promise<void>;

}

export{TCreateAddressBody,TReturnAddress,IAddressService,TUpdateAddressBody};