import { injectable } from "tsyringe";
import { prisma } from "../database/prisma";
import {TClient,TClientRegister, TClientReturn,TClientUpdate,} from "./interfaces";
import bcryptjs from "bcryptjs";
import { clientReturnSchema } from "./schemas";
import { loadedStore } from "../app";

@injectable()
export class ClientServices {
  register = async (payload: TClientRegister): Promise<TClientReturn> => {
    const pwd: string = await bcryptjs.hash(payload.password, 10);
    const dateValue = new Date(payload.birthDate);

    const newClient = {
      ...payload,
      birthDate: dateValue,
      password: pwd,      
      storeId: loadedStore.id,
    };


    const createdClient = await prisma.client.create({
      data: newClient,
      include: { address: true },
    });

    return clientReturnSchema.parse(createdClient);
  };

  get = async (): Promise<Array<TClientReturn>> => {
    const loadClients: TClient[] = (await prisma.client.findMany({
      include: { address: true },
    })) as TClient[];

    return clientReturnSchema.array().parse(loadClients);
  };

  getOne = async (publicId: string): Promise<TClientReturn> => {
    const clientFound: TClient = (await prisma.client.findFirst({
      where: { publicId },
      include: { address: true },
    })) as TClient;

    return clientReturnSchema.parse(clientFound);
  };

  update = async (
    publicId: string,
    data: TClientUpdate
  ): Promise<TClientReturn> => {
    const clientFound: TClient = (await prisma.client.findFirst({
      where: { publicId },
    })) as TClient;
    let newDataClient;
    if (data.password) {
      const pwd: string = await bcryptjs.hash(data.password, 10);
      newDataClient = { ...clientFound, ...data, password: pwd };
    } else {
      newDataClient = { ...clientFound, ...data };
    }

    const clientUpdated = await prisma.client.update({
      where: { publicId },
      data: newDataClient,
      include: { address: true },
    });

    return clientReturnSchema.parse(clientUpdated);
  };

  remove = async (publicId: string): Promise<void> => {
    await prisma.client.delete({ where: { publicId } });
    return;
  };
}
