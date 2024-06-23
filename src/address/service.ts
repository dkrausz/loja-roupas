import { prisma } from "../database/prisma";
import { IAddressService, TCreateAddressBody, TReturnAddress, TUpdateAddressBody } from "./interfaces";
import { addressSchema } from "./schemas";


class AddressService implements IAddressService{

  public create=async(payload:TCreateAddressBody):Promise<TReturnAddress>=>{
    const newAddress = await prisma.address.create({data:payload});  
    return addressSchema.parse(newAddress); 
  };

  public getAddressById = async(id:number):Promise<TReturnAddress>=>{
    const address = await prisma.address.findFirst({where:{id}});
    return addressSchema.parse(address);
  };

  public getAddressByUser= async(clientId:number):Promise<Array<TReturnAddress>>=>{
    const addresses = await prisma.address.findMany({where:{clientId}});
    return addressSchema.array().parse(addresses);
  };

  public updateAddress = async(payload:TUpdateAddressBody,id:number):Promise<TReturnAddress>=>{
    const address = await prisma.address.update({where:{id} , data:payload});
    return addressSchema.parse(address);
  };

  public deleteAddress = async(id:number):Promise<void>=>{
    await prisma.address.delete({where:{id}});
  };
}