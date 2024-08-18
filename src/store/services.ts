import { injectable } from "tsyringe";
import { getStoreSchema, returnStoreSchema } from "./schemas";
import { TCreateStore, TReturnStore, TUpdateStore } from "./interfaces";
import { prisma } from "../database/prisma";
import { initStore } from "../configs/initStore.config";
import { loadedStore } from "../app";


export let storeIdActive = 0;
@injectable()
export class StoreServices {
  async getMany(): Promise<TReturnStore[]> {
    const storeList = await prisma.store.findMany({
      include: { address: true },
    });

    return returnStoreSchema.array().parse(storeList);
  }

  async getOne(id: number): Promise<TReturnStore> {
    const store = await prisma.store.findFirst({ where: { id } });

    return getStoreSchema.parse(store);
  }

  async create(body: TCreateStore): Promise<TReturnStore> {
    const newAddress = await prisma.address.create({ data: body.address });

    const storeData = {
      name: body.name,
      CNPJ: body.CNPJ,
      addressId: newAddress.id,
    };

    const newStore = await prisma.store.create({ data: storeData });
    await initStore(loadedStore);
    console.log(loadedStore);

    return returnStoreSchema.parse(newStore);
  }

  async update(id: number, body: TUpdateStore): Promise<TReturnStore> {
    const updateStore = await prisma.store.findFirst({ where: { id } });

    const updatedStore = { ...updateStore, ...body };

    return returnStoreSchema.parse(updatedStore);
  }

  async delete(id: number) {
    return prisma.store.delete({ where: { id } });
  }
}
