import {z} from "zod";
import { addressSchema, createAddressBodySchema, updateAddressBodySchema } from "./schemas";

type TCreateAddressBody = z.infer<typeof createAddressBodySchema>;
type TReturnAddress = z.infer<typeof addressSchema>;
type TUpdateAddressBody = z.infer<typeof updateAddressBodySchema>;


interface IAddressService{
  createAddress(payload:TCreateAddressBody,publicId:string):Promise<TReturnAddress>;
  getAddressById(id:number):Promise<TReturnAddress>;
  getAddressByUser(clientId:string):Promise<Array<TReturnAddress>>;
  updateAddress(payload:TUpdateAddressBody, addressId:number):Promise<TReturnAddress>;
  deleteAddress(id:Number):Promise<void>;

}

export{TCreateAddressBody,TReturnAddress,IAddressService,TUpdateAddressBody};