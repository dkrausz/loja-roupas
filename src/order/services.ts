import { injectable } from "tsyringe";
import {
  TOrder,
  TOrderUpdate,
  TPayloadOrder,
  TReturnOrder,
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
  register = async (payload: TPayloadOrder): Promise<TReturnOrder> => {
    const itemsList = payload.products.map((item) => {
      return { id: item };
    });

    const newOrder = await prisma.order.create({
      data: {
        paymentType: payload.paymentType,
        clientId: payload.clientId,
        status: payload.status,
        discount: payload.discount,
        total: payload.total,
        storeId: payload.storeId,
        date: new Date(),
        products: {
          connect: itemsList,
        },
      },
      include: {
        products: true,
      },
    });

    return returnOrderSchema.parse(newOrder);
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
