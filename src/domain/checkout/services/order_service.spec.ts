import { faker } from '@faker-js/faker';

import { OrderEntity, OrderItemEntity } from '@/domain/checkout';
import { AddressEntity, CustomerEntity } from '@/domain/customer';
import { OrderService } from './order_service';

describe('OrderService', () => {
  it('should place an checkout', () => {
    const customer = new CustomerEntity(
      faker.datatype.uuid(),
      faker.name.findName(),
      new AddressEntity(
        faker.address.street(),
        faker.address.buildingNumber(),
        faker.address.cityName(),
        faker.address.zipCode('###.##-###')
      )
    );

    const prevReward = customer.rewardPoints;

    const orderItems = Array.from(
      { length: 3 },
      () =>
        new OrderItemEntity(
          faker.datatype.uuid(),
          faker.commerce.productName(),
          faker.datatype.number({ min: 1, max: 500 }),
          faker.datatype.uuid(),
          faker.datatype.number({ min: 1, max: 10 })
        )
    );

    const order = OrderService.placeOrder(customer, orderItems);

    const total = orderItems.reduce(
      (prevValue, currentOrderItem) => prevValue + currentOrderItem.price,
      0
    );
    expect(customer.rewardPoints).toBe(order.total / 2 + prevReward);
    expect(order.total).toBe(total);
  });

  it('should return a total of all orders', () => {
    const orders = Array.from({ length: 3 }, () => {
      return new OrderEntity(
        faker.datatype.uuid(),
        faker.datatype.uuid(),
        Array.from(
          { length: 4 },
          () =>
            new OrderItemEntity(
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
