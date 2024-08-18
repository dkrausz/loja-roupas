import { injectable } from "tsyringe";
import { prisma } from "../database/prisma";
import {IAddressService,TCreateAddressBody,TReturnAddress,TUpdateAddressBody,} from "./interfaces";
import { addressSchema } from "./schemas";
import { AppError } from "../@shared/errors";

@injectable()
export class AddressService implements IAddressService {

  public createAddress = async (payload: TCreateAddressBody, publicId: string): Promise<TReturnAddress> => {
    const client = await prisma.client.findFirst({ where: { publicId } });

    if (!client) {
      throw new AppError(404, "Client not Found");
    }

    const addressData = { ...payload, clientId: client.id };
    const newAddress = await prisma.address.create({ data: addressData });
    return addressSchema.parse(newAddress);
  };

  public getAddressById = async (id: number): Promise<TReturnAddress> => {
    const address = await prisma.address.findFirst({ where: { id } });
    return addressSchema.parse(address);
  };

  public getAddressByUser = async (clientId: string): Promise<Array<TReturnAddress>> => {
    const client = await prisma.client.findFirst({where:{publicId:clientId}});        

    const addresses = await prisma.address.findMany({ where: { clientId:client?.id } });

    return addressSchema.array().parse(addresses);
  };

  public updateAddress = async (payload: TUpdateAddressBody, addressId: number): Promise<TReturnAddress> => {
        
    const address = await prisma.address.update({where: { id:addressId },data: payload,});
    return addressSchema.parse(address);
  };

  public deleteAddress = async (id: number): Promise<void> => {
    await prisma.address.delete({ where: { id } });
  };
}
