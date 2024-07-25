import { injectable } from "tsyringe";
import { prisma } from "../database/prisma";
import {
  TClient,
  TClientRegister,
  TClientReturn,
  TClientUpdate,
} from "./interfaces";
import bcryptjs from "bcryptjs";
import { clientReturnSchema } from "./schemas";
import { string } from "zod";
@injectable()
export class ClientServices {
  register = async (payload: TClientRegister): Promise<TClientReturn> => {
    const pwd: string = await bcryptjs.hash(payload.password, 10);
    const dateValue = new Date(payload.birthDate);

    const newClient: TClientRegister = {
      ...payload,
      birthDate: dateValue,
      password: pwd,
    };

    const createdClient = await prisma.client.create({ data: newClient });
    return clientReturnSchema.parse(createdClient);
  };

  get = async (): Promise<Array<TClientReturn>> => {
    const loadClients = await prisma.client.findMany({include:{address:true}});

    return clientReturnSchema.array().parse(loadClients);
  };

  getOne = async (publicId: string): Promise<TClientReturn> => {
    const clientFound: TClient = (await prisma.client.findFirst({
      where: { publicId },
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
    const clientUpdated = { ...clientFound, ...data };

    return clientReturnSchema.parse(clientUpdated);
  };

  remove = async (publicId: string): Promise<void> => {
    await prisma.client.delete({ where: { publicId } });
    return;
  };
}
