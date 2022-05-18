import { IOrder, OrderStatus } from "../interfaces/IOrder";
import { IUser } from "../interfaces/IUser";
import { prisma } from "./InitPrismaClient";

export const getOrderById = async (id: number) => {
    return prisma.order.findUnique({
        where: { id: id },
        include: {
            orderItem: true
        }
    })
}

export const getOrdersByUser = async (user: IUser, page: number = 0,
    pageSize: number = 10) => {
    return prisma.order.findMany({
        skip: page * pageSize,
        take: pageSize,
        where: { userId: user.id },
        include: {
            orderItem: true,
            _count: true
        }
    })
}

export const getOrdersByStatus = async (orderStatus: OrderStatus, page: number = 0,
    pageSize: number = 10) => {
    return prisma.order.findMany({
        skip: page * pageSize,
        take: pageSize,
        where: { status: orderStatus },
        include: {
            orderItem: true,
            _count: true
        }
    })
}

export const createOrder = async (order: IOrder) => {
    return prisma.order.create({
        data: {
            User: {
                connect: {
                    id: order.user?.id
                }
            }
        }
    })
}

export const updateOrder = async (order: IOrder) => {
    const dbOrder = await getOrderById(order.id);
    if (dbOrder) {
        const dbStatus: OrderStatus = dbOrder.status.toString() as OrderStatus;

        const updatedOrder = {
            ...dbOrder,
            status: order.status ? order.status : dbStatus,
        }

        return prisma.order.update({
            where: {
                id: dbOrder.id
            },
            data: {
                status: updatedOrder.status,
                orderItem: {
                    deleteMany: {},
                }
            }
        })
    }

    return null;
}

export const deleteOrder = async (orderId: number) => {
    const dbOrder = await getOrderById(orderId);
    if (dbOrder) {
        await prisma.order.update({
            where: {
                id: orderId
            },
            data: {
                orderItem: {
                    deleteMany: {}
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