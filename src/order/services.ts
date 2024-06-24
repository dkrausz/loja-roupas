import { injectable } from "tsyringe";
import { TOrder, TOrderRegister, TOrderUpdate } from "./interfaces";
import { prisma } from "../database/prisma";
import { orderSchema } from "./schemas";

@injectable()
export class OrderServices {
  register = async (data: TOrderRegister): Promise<TOrder> => {
    const newOrder: TOrder = await prisma.order.create({ data });

    return orderSchema.parse(newOrder);
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

  updateOrder = async (id: number, newData: TOrderUpdate): Promise<TOrder> => {
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
