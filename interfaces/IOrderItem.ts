import { IOrder } from './IOrder';
import { IProduct } from './IProduct';

export interface IOrderItem {
    id: number,
    product: IProduct,
    quantity: number,
    order: IOrder
}