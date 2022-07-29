import { v4 as uuid } from 'uuid';

import { CustomerEntity } from '@/domain/customer';
import { OrderEntity, OrderItemEntity } from '@/domain/checkout';

export class OrderService {
  static total(orders: OrderEntity[]): number {
    return orders.reduce(
      (prevValue, currentOrder) => prevValue + currentOrder.total,
      0
    );
  }

  static placeOrder(
    customer: CustomerEntity,
    items: OrderItemEntity[]
  ): OrderEntity {
    const order = new OrderEntity(uuid(), customer.id, items);
    customer.updateRewardPoints(order.total / 2);

    return order;
  }
}
