import { Order } from "@prisma/client";
import { IOrderItem } from "../interfaces/IOrderItem";
import { prisma } from "./InitPrismaClient";

export const getOrderItemById = async (id: number) => {
    return prisma.orderItem.findUnique({
        where: { id: id }
    })
}

export const getOrderItemsByOrder = async (order: Order) => {
    return prisma.orderItem.findMany({
        where: { orderId: order.id }
    })
}

export const createOrderItem = async (orderItem: IOrderItem, orderId: number) => {
    return prisma.orderItem.create({
        data: {
            product: {
                connect: {
                    id: orderItem.product.id
                }
            },
            Order: {
                connect: {
                    id: orderId
                }
            },
            quantity: orderItem.quantity
        }
    })
}

export const updateOrderItem = async (orderItem: IOrderItem, orderId: number) => {
    const dbOrderItem = await getOrderItemById(orderItem.id);

    if (dbOrderItem) {
        const updatedOrderItem = {
            ...dbOrderItem,
            quantity: orderItem.quantity? orderItem.quantity : dbOrderItem.quantity
        }

        return prisma.orderItem.update({
            where: {
                id: dbOrderItem.id
            },
            data: {
                quantity: updatedOrderItem.quantity
            }
        })
    }

    return createOrderItem(orderItem, orderId);
}

export const deleteOrderItem = async (orderItemId: number) => {
    const dbOrderItem = await getOrderItemById(orderItemId);

    if(dbOrderItem) {
        return prisma.orderItem.delete({
            where: {
                id: dbOrderItem.id
            }
        })
    }
}