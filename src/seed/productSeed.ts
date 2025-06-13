import superFakerBrasil from "faker-brasil";
import { prisma } from "../database/prisma";

const quantity = 500;
const FakerBrasil = new superFakerBrasil();

const newProduct = () => {
  const product = {
    name: FakerBrasil.clothesProduct(false).product,
    description: "Esta peça é confeccionada com tecido de alta qualidade, proporcionando conforto e estilo para diversas ocasiões. ",
    price: FakerBrasil.clothesProduct(false).price * 100,
    storeId: 1,
  };
  return product;
};

const seed = async () => {
  for (let i = 0; i < quantity; i++) {
    const product = newProduct();
    await prisma.product.create({ data: product });
  }
};

seed();
