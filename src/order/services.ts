import { injectable } from "tsyringe";
import {
  TOrder,
  TOrderRegister,
  TOrderUpdate,
  TRegisterProductInOrder,
  TOrderList,
  TPayloadOrder,
} from "./interfaces";
import { prisma } from "../database/prisma";
<<<<<<< HEAD
import { orderSchema, returnOrderSchema } from "./schemas";
=======
import { orderSchema } from "./schemas";
import { date } from "zod";

>>>>>>> parent of 3318910 (feat: order IsIdExisting.middleware)
@injectable()
export class OrderServices {
  register = async (payload: TPayloadOrder) => {
    const orderData = { ...payload, date: new Date(), products: {} };

    const newOrderData: TOrder = await prisma.order.create({ data: orderData });
    const itemsList = payload.products.map((item) => {
      return { id: item };
    });

    const completOrder = await prisma.order.update({
      where: { id: newOrderData.id },
      data: {
        products: { connect: itemsList },
      },
      include: { products: true },
    });
    return returnOrderSchema.parse(completOrder);
  };

  get = async (): Promise<Array<TOrder>> => {
    const ordersList: TOrder[] = await prisma.order.findMany();

    return orderSchema.array().parse(ordersList);
  };

  getOrder = async (id: number): Promise<TOrder> => {
    const orderFound: TOrder = (await prisma.order.findFirst({
      where: { id },
    })) as TOrder;

    return orderSchema.parse(orderFound);
  };

<<<<<<< HEAD
  // getOrder = async (publicId: string) => {
  //   const orderProducts = await prisma.order.findFirst({
  //     where: { publicId },
  //     include: { products: true },
  //   });
  //
  //   return orderProducts;
  // };

  updateOrder = async (
    publicId: string,
    newData: TOrderUpdate
  ): Promise<TOrder> => {
=======
  updateOrder = async (id: number, newData: TOrderUpdate): Promise<TOrder> => {
>>>>>>> parent of 3318910 (feat: order IsIdExisting.middleware)
    const orderToUpdate: TOrder = (await prisma.order.findFirst({
      where: { id },
    })) as TOrder;
    const orderUpdated: TOrder = { ...orderToUpdate, ...newData };

    return orderSchema.parse(orderUpdated);
  };

  deleteOrder = async (id: number) => {
    return prisma.order.delete({ where: { id } });
  };
}
