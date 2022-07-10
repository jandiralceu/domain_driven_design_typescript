import { Order } from '../entities';

export class OrderService {
  static total(orders: Order[]): number {
    return orders.reduce(
      (prevValue, currentOrder) => prevValue + currentOrder.total,
      0
    );
  }
}
