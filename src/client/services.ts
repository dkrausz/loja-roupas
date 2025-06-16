import { injectable } from "tsyringe";
import { prisma } from "../database/prisma";
import { TClient, TClientRegister, TClientReturn, TClientReturnComplete, TClientUpdate } from "./interfaces";
import bcryptjs from "bcryptjs";
import { clientReturnSchema, completeReturnSchema } from "./schemas";
import { loadedStore } from "../app";
import { AppError } from "../@shared/errors";

@injectable()
export class ClientServices {
  public register = async (payload: TClientRegister): Promise<TClientReturn> => {
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

  public get = async (): Promise<Array<TClientReturn>> => {
    const loadClients: TClient[] = (await prisma.client.findMany({
      include: { address: true },
    })) as TClient[];

    return clientReturnSchema.array().parse(loadClients);
  };

  public getOne = async (publicId: string): Promise<TClientReturn> => {
    const clientFound: TClient = (await prisma.client.findFirst({
      where: { publicId },
      include: { address: true },
    })) as TClient;

    return clientReturnSchema.parse(clientFound);
  };

  public getComplete = async (publicId: string): Promise<TClientReturnComplete> => {
    const clientFound: TClient = (await prisma.client.findFirst({
      where: { publicId },
      include: { address: true },
    })) as TClient;

    return completeReturnSchema.parse(clientFound);
  };

  public update = async (publicId: string, data: TClientUpdate): Promise<TClientReturn> => {
    const clientFound = await prisma.client.findFirst({
      where: { publicId },
    });
    if (!clientFound) {
      throw new AppError(404, "Client not found");
    }
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

  public remove = async (publicId: string): Promise<void> => {
    await prisma.client.delete({ where: { publicId } });
    return;
  };
}
