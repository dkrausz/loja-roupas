import { inject, injectable } from "tsyringe";
import { TOrder, TOrderRegister, TOrderUpdate, TReturnOrder } from "./interfaces";
import { prisma } from "../database/prisma";
import { orderSchema, returnOrderSchema } from "./schemas";
import { IProductService } from "../products/interfaces";

import { AppError } from "../@shared/errors";
import { loadedStore } from "../app";
import { ClientServices } from "../client/services";

@injectable()
export class OrderServices {
  constructor(@inject("ProductService") private productService: IProductService, @inject(ClientServices) private clientService: ClientServices) {}

  public createOrder = async (payload: TOrderRegister, clientId: string) => {
    const client = await this.clientService.getComplete(clientId);
    const completedProducts = await Promise.all(
      payload.orderItems.map(async (product) => {
        const retrievedProduct = await this.productService.getOneProductComplete(product.productPublicId);
        const subTotal = product.quantity * retrievedProduct.price;
        return { product: { connect: { id: retrievedProduct.id } }, quantity: product.quantity, priceUnit: retrievedProduct.price, subTotal: subTotal };
      })
    );

    const total = completedProducts.reduce((acc, item) => acc + item.subTotal, 0);

    const newOrder = {
      createdAt: new Date(),
      paymentType: payload.paymentType,
      clientId: client.id,
      status: payload.status,
      discount: payload.discount,
      total: total,
      storeId: loadedStore.id,
      orderItems: { create: completedProducts },
    };

    const createdOrder = await prisma.order.create({ data: newOrder, include: { client: true, orderItems: { include: { product: true } } } });

    return returnOrderSchema.parse(createdOrder);
  };

  public get = async (): Promise<Array<TReturnOrder>> => {
    const ordersList = await prisma.order.findMany({
      include: { client: true, orderItems: { include: { product: true } } },
    });

    return returnOrderSchema.array().parse(ordersList);
  };

  public getOrder = async (publicId: string) => {
    const orderProducts = await prisma.order.findFirst({
      where: { publicId },
      include: { client: true, orderItems: { include: { product: true } } },
    });

    return returnOrderSchema.parse(orderProducts);
  };

  // updateOrder = async (publicId: string, newData: TOrderUpdate): Promise<TOrder> => {
  //   const getOrder = await prisma.order.findFirst({
  //     where: { publicId },
  //   });
  //   if (getOrder) {
  //     const orderUpdated = await prisma.order.update({
  //       where: { id: getOrder.id },
  //       data: newData,
  //     });
  //     return orderSchema.parse(orderUpdated);
  //   }
  //   throw new AppError(404, "Usuario não encontrado");
  // };

  deleteOrder = async (publicId: string) => {
    return prisma.order.deleteMany({ where: { publicId } });
  };
}
