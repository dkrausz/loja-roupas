import axios from "axios";
import { prisma } from "../database/prisma";

export const initStore = async () => {
  const store = await prisma.store.findFirst();
  if (store) {
    console.log(`Bem vindo a loja ${store.name}`);
  } else {
    console.log("Nenhuma Loja cadastrada.");
  }
};
