import { injectable } from "tsyringe";
import {
  TOrder,
  TOrderUpdate,
  TPayloadOrder,
  TReturnOrder,
} from "./interfaces";
import { prisma } from "../database/prisma";
import { orderSchema, orderUpdateSchema, returnOrderSchema } from "./schemas";
import { TProduct } from "../products/interfaces";
import { populate } from "dotenv";

@injectable()
export class OrderServices {
  register = async (payload: TPayloadOrder): Promise<TReturnOrder> => {
    const itemsList = payload.products?.map((item) => {
      return { id: item };
    }) as [];

    const newOrder = await prisma.order.create({
      data: {
        paymentType: payload.paymentType,
        clientId: payload.clientId,
        status: payload.status,
        discount: payload.discount,
        total: payload.total,
        storeId: payload.storeId,
        date: new Date(),
        products: { connect: itemsList },
      },
      include: {
        products: true,
      },
    });
    return returnOrderSchema.parse(newOrder);
  };

  get = async (): Promise<Array<TReturnOrder>> => {
    const ordersList: TOrder[] = await prisma.order.findMany({
      include: { products: true },
    });

    return returnOrderSchema.array().parse(ordersList);
  };

  // getOrder = async (id: number): Promise<TOrder> => {
  //   const orderFound: TOrder = (await prisma.order.findFirst({
  //     where: { id },
  //   })) as TOrder;

  //   return orderSchema.parse(orderFound);
  // };

  getOrder = async (publicId: string) => {
    const orderProducts = await prisma.order.findFirst({
      where: { publicId },
      include: { products: true },
    });

    return returnOrderSchema.parse(orderProducts);
  };

  updateOrder = async (
    publicId: string,
    newData: TOrderUpdate
  ): Promise<TOrder> => {
    const getOrder: TOrder = (await prisma.order.findFirst({
      where: { publicId },
    })) as TOrder;

    const orderUpdated = await prisma.order.update({
      where: { id: getOrder.id },
      data: newData,
    });

    return orderSchema.parse(orderUpdated);
  };

  deleteOrder = async (publicId: string) => {
    return prisma.order.deleteMany({ where: { publicId } });
  };
}
