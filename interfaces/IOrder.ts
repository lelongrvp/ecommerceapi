import { IUser } from './IUser';
import { IOrderItem } from './IOrderItem';

export interface IOrder {
    id: number,
    status: OrderStatus,
    orderItem?: IOrderItem[],
    user?: IUser
}

export enum OrderStatus {
    NEW = 'NEW',
    APPROVED = 'APPROVED',
    CANCELED = 'CANCELED'
}