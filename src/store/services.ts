import { injectable } from "tsyringe";
import { TCreateStore, TReturnStore, TUpdateStore, storeSchema } from "./schemas";
import { prisma } from "../database/prisma";

@injectable()
export class StoreServices {
    async getMany(): Promise<TReturnStore[]> {
        const storeList = await prisma.store.findMany();

        return storeList;
    };

    async getOne(id: number): Promise<TReturnStore> {
        const store = await prisma.store.findFirst({ where: { id } });

        return storeSchema.parse(store);
    };

    async create(body: TCreateStore): Promise<TReturnStore> {
        const newStore = await prisma.store.create({ data: body });

        return storeSchema.parse(newStore);
    };

    async update(id: number, body: TUpdateStore): Promise<TReturnStore> {
        const updateStore = await prisma.store.findFirst({ where: { id } });

        const updatedStore = { ...updateStore, ...body };

        return storeSchema.parse(updatedStore);
    };

    async delete(id: number) {
        return prisma.store.delete({ where: { id } })
    };
};