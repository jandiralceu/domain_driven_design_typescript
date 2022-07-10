import { v4 as uuid } from 'uuid';
import { Order, Customer, OrderItem } from '../entities';

export class OrderService {
  static total(orders: Order[]): number {
    return orders.reduce(
      (prevValue, currentOrder) => prevValue + currentOrder.total,
      0
    );
  }

  static placeOrder(customer: Customer, items: OrderItem[]): Order {
    const order = new Order(uuid(), customer.id, items);
    customer.updateRewardPoints(order.total / 2);

    return order;
  }
}
