import { IOrder, OrderStatus } from "../interfaces/IOrder";
import { prisma } from "./InitPrismaClient";
import { getOrderItemsByOrder } from "./orderItem";
var deepEqual = require('deep-equal')

export const getOrderById = async (id: number) => {
    return prisma.order.findUnique({
        where: { id: id }
    })
}

export const getOrdersByUser = async (userId: number, page: number = 0, 
                                    pageSize: number = 10) => {
    return prisma.order.findMany({
        skip: page * pageSize,
        take: pageSize,
        where: { userId: userId }
    })
}

export const getOrdersByStatus = async (orderStatus: OrderStatus, page: number = 0,
                                        pageSize: number = 10) => {
    return prisma.order.findMany({
        skip: page * pageSize,
        take: pageSize,
        where: { status: orderStatus }
    })
}

export const createOrder = async (order: IOrder) => {
    return prisma.order.create({
        data: {
            User: {
                connect: order.user
            }
        }
    })
}

export const updateOrder = async (oldOrder: IOrder, newOrder: IOrder) => {
    const dbOrder = await getOrderById(oldOrder.id);
    if(dbOrder){
        const dbStatus: OrderStatus = dbOrder.status.toString() as OrderStatus;

        const dbOrderItem = await getOrderItemsByOrder(dbOrder);

        const updatedOrder: IOrder = {
            ...dbOrder,
            status: newOrder.status ? newOrder.status : dbStatus,
        }

        return prisma.order.update({
            where: {
                id: dbOrder.id
            },
            data: {
                status: updatedOrder.status,
                orderItem: {
                    connect: newOrder.orderItem?.map(item => ({id: item.id}))
                }
            }
        })
    }
}

export const deleteOrder = async (orderId: number) => {
    const dbOrder = await getOrderById(orderId);
    if(dbOrder) {
        await prisma.order.update({
            where: {
                id: orderId
            },
            data: {
                orderItem: {
                    deleteMany: {
                        orderId: orderId
                    }
                }
            }
        })

        return prisma.order.delete({
            where: {
                id: orderId
            }
        })
    }
}