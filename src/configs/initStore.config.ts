import { prisma } from "../database/prisma";
import { IStoreId } from "../store/interfaces";

export const initStore = async (loadedStore: IStoreId) => {
  const store = await prisma.store.findFirst();
  if (store) {
    console.log(`Bem vindo à loja ${await store.name}`);
    loadedStore.id = await store.id;
    return loadedStore;
  } else {
    console.log("Nenhuma Loja cadastrada.");
    return (loadedStore = { id: 0 });
  }
};
