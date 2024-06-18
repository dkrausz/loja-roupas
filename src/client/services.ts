import { injectable } from "tsyringe";
import { prisma } from "../database/prisma";
import { TClientRegister, TClientReturn, TClientUpdate } from "./interfaces";

@injectable()
export class ClientServices {
  register = async (data: TClientRegister): Promise<TClientReturn | null> => {
    return null;
  };

  get = async (): Promise<Array<TClientReturn> | null> => {
    return null;
  };

  getOne = async (id: number): Promise<TClientReturn | null> => {
    return null;
  };

  update = async (data: TClientUpdate): Promise<TClientReturn | null> => {
    return null;
  };

  exclude = async (id: number) => {};
}
