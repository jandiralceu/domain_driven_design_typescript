import { faker } from '@faker-js/faker';
import { Order, OrderItem } from '../entities';
import { OrderService } from './order';

describe('OrderService', () => {
  it('should return a total of all orders', () => {
    const orders = Array.from({ length: 3 }, () => {
      return new Order(
        faker.datatype.uuid(),
        faker.datatype.uuid(),
        Array.from(
          { length: 4 },
          () =>
            new OrderItem(
              faker.datatype.uuid(),
              faker.commerce.productName(),
              faker.datatype.number({ min: 1, max: 1000 }),
              faker.datatype.uuid(),
              faker.datatype.number({ min: 1, max: 10 })
            )
        )
      );
    });

    const total = orders.reduce(
      (prevValue, currentOrder) => prevValue + currentOrder.total,
      0
    );

    expect(OrderService.total(orders)).toBe(total);
  });
});
