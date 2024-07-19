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
import { orderSchema, returnOrderSchema } from "./schemas";
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

  getOrder = async (publicId: string): Promise<TOrder> => {
    const orderFound: TOrder = (await prisma.order.findFirst({
      where: { publicId },
    })) as TOrder;

    return orderSchema.parse(orderFound);
  };

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
    const orderToUpdate: TOrder = (await prisma.order.findFirst({
      where: { publicId },
    })) as TOrder;
    const orderUpdated: TOrder = { ...orderToUpdate, ...newData };

    return orderSchema.parse(orderUpdated);
  };

  deleteOrder = async (publicId: string) => {
    return await prisma.order.deleteMany({ where: { publicId } });
  };
}
