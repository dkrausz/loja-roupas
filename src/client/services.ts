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
@injectable()
export class ClientServices {
  register = async (payload: TClientRegister): Promise<TClientReturn> => {
    const pwd: string = await bcryptjs.hash(payload.password, 10);
    const newClient: TClientRegister = {
      ...payload,
      password: pwd,
    };

    const createdClient = await prisma.client.create({ data: newClient });
    return clientReturnSchema.parse(createdClient);
  };

  get = async (): Promise<Array<TClientReturn>> => {
    const loadClients = prisma.client.findMany();

    return clientReturnSchema.array().parse(loadClients);
  };

  getOne = async (id: number): Promise<TClientReturn> => {
    const clientFound: TClient = (await prisma.client.findFirst({
      where: { id },
    })) as TClient;
    return clientReturnSchema.parse(clientFound);
  };

  update = async (id: number, data: TClientUpdate): Promise<TClientReturn> => {
    const clientFound: TClient = (await prisma.client.findFirst({
      where: { id },
    })) as TClient;
    const clientUpdated = { ...clientFound, ...data };

    return clientReturnSchema.parse(clientUpdated);
  };

  remove = async (id: number) => {
    prisma.client.delete({ where: { id } });
  };
}
