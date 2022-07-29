import { v4 as uuid } from 'uuid';
import { faker } from '@faker-js/faker';
import { OrderEntity } from '@/domain/checkout';
import { OrderFactory, OrderFactoryProps } from './order.factory';

describe('OrderFactory', () => {
  it('should create an Order', () => {
    const orderValues: OrderFactoryProps = {
      id: uuid(),
      customerId: uuid(),
      items: [
        {
          id: uuid(),
          name: faker.commerce.product(),
          productId: faker.datatype.uuid(),
          quantity: faker.datatype.number({ min: 1, max: 20 }),
          price: faker.datatype.float(),
        },
      ],
    };

    const order = OrderFactory.create(orderValues);

    expect(order).toBeInstanceOf(OrderEntity);
  });
});
