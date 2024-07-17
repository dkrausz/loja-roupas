import { injectable } from "tsyringe";
import { TOrder, TOrderRegister, TOrderUpdate } from "./interfaces";
import { prisma } from "../database/prisma";
import { orderSchema } from "./schemas";
@injectable()
export class OrderServices {
  register = async (payload: TOrderRegister): Promise<TOrder> => {
    console.log(payload);
    const orderData = { ...payload, date: new Date() };
    console.log(orderData);
    const newOrder: TOrder = await prisma.order.create({ data: orderData });
    console.log(newOrder);
    return orderSchema.parse(newOrder);
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
