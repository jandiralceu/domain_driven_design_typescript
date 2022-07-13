import { Order } from '@/domain/entities';
import { IOrderRepository } from '@/domain/repositories';
import { OrderItemModel, OrderModel } from '@/infrastructure/db';

export class OrderRepository implements IOrderRepository {
  async create(order: Order): Promise<void> {
    await OrderModel.create(
      {
        id: order.id,
        total: order.total,
        customer_id: order.customerId,
        items: order.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.unitPrice,
          quantity: item.quantity,
          product_id: item.productId,
        })),
      },
      { include: [{ model: OrderItemModel }] }
    );
  }

  find(id: string): Promise<Order> {
    return Promise.resolve({} as Order);
  }

  findAll(): Promise<Order[]> {
    return Promise.resolve([]);
  }

  update(order: Order): Promise<void> {
    return Promise.resolve(undefined);
  }
}
