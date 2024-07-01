import { injectable } from "tsyringe";
import { TCreateStore, TReturnStore, TUpdateStore, getStoreSchema, returnStoreSchema } from "./schemas";
import { prisma } from "../database/prisma";

@injectable()
export class StoreServices {
    async getMany(): Promise<TReturnStore[]> {
        const storeList = await prisma.store.findMany();

        return getStoreSchema.array().parse(storeList);
    };

    async getOne(id: number): Promise<TReturnStore> {
        const store = await prisma.store.findFirst({ where: { id } });

        return getStoreSchema.parse(store);
    };

    async create(body: TCreateStore): Promise<TReturnStore> {
        const newStore = await prisma.store.create({ data: body });

        return returnStoreSchema.parse(newStore);
    };

    async update(id: number, body: TUpdateStore): Promise<TReturnStore> {
        const updateStore = await prisma.store.findFirst({ where: { id } });

        const updatedStore = { ...updateStore, ...body };

        return returnStoreSchema.parse(updatedStore);
    };

    async delete(id: number) {
        return prisma.store.delete({ where: { id } })
    };
};