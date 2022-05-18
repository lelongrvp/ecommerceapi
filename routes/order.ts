import { authenticateAdmin } from './../server';
import { IOrderItem } from './../interfaces/IOrderItem';
import { getOrderById, getOrdersByUser, getOrdersByStatus, createOrder, updateOrder, deleteOrder } from "../services/order";
import { createOrderItem } from "../services/orderItem";
import router from "./user";

router.get("", async (req: any, res: any) => {
    const [id] = req.query;

    const order = await getOrderById(id);
    if (order) {
        return res.status(200).send(order);
    }

    return res.status(404).send();
})

router.get("", async (req: any, res: any) => {
    const [user, page, pageSize] = req.query;

    const orders = await getOrdersByUser(user, page, pageSize);
    if (orders) {
        return res.status(200).send(orders);
    }

    return res.status(404).send();
})

router.get("", async (req: any, res: any) => {
    const [status, page, pageSize] = req.query;

    const orders = await getOrdersByStatus(status, page, pageSize);
    if (orders) {
        return res.status(200).send(orders);
    }

    return res.status(404).send();
})

router.post("", async (req: any, res: any) => {
    const [order] = req.body;

    const createdOrder = await createOrder(order);
    order.orderItems.map(async (item: IOrderItem) => await createOrderItem(item, createdOrder.id));

    return res.status(200).send();
});

router.put("", async (req: any, res: any) => {
    const [order] = req.body;

    const updatedOrder = await updateOrder(order);
    if (updatedOrder) {
        order.orderItems.map(async (item: IOrderItem) => await createOrderItem(item, updatedOrder.id));
        return res.status(200).send(updatedOrder);
    }

    return res.status(404).send();
})

router.delete("", authenticateAdmin, async (req: any, res: any) => {
    const [order] = req.body;

    const deletedOrder = await deleteOrder(order);
    if (deletedOrder) {
        return res.status(200).send(deletedOrder);
    }

    return res.status(404).send();
})