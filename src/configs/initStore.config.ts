import axios from "axios";
import { prisma } from "../database/prisma";

export const initStore = async () => {
  const storeValid = (await prisma.store.count()) > 0;
  const prompt = require("prompt-sync")();

  if (!storeValid) {
    const storeName = prompt("Nome da Loja: ");
    const CNPJ = prompt("CNPJ:");

    const street = prompt("Rua: ");
    const number = Number(prompt("Número: "));
    const complement = prompt("Complemento: ");
    const zipCode = prompt("CEP: ");
    const neighborhood = prompt("Bairro: ");
    const city = prompt("Cidade: ");
    const state = prompt("Estado: ");

    const newStore = {
      name: storeName,
      CNPJ: CNPJ,
      address: {
        street,
        number,
        complement,
        zipCode,
        neighborhood,
        state,
        city,
        country: "Brasil",
      },
    };

    const { data } = await axios.post("http://localhost:3000/store", newStore);

    const store = await prisma.store.findFirst({
      where: { publicId: data.publicId },
    });

    console.log(`Loja ${store?.name} iniciada.`);

    return store?.id;
  } else {
    // const storesList = await prisma.store.findMany();
    // console.log("Escolha a loja cadastrada: (digite o ID correspondente)");
    // for (let i = 0; i < storesList.length; i++) {
    //   console.log(`ID: ${storesList[i].id} ${storesList[i].name}}`);
    // }
    // const activeStore = Number(prompt("Loja: "));
    // return activeStore;
    const store = await prisma.store.findFirst();
    console.log(`Loja ${store?.name} iniciada.`);
    return store?.id;
  }
};
