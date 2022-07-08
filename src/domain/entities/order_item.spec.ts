import { faker } from '@faker-js/faker';

import { OrderItem } from './order_item';

describe('OrderItem', () => {
  let mockOrderItem: OrderItem;
  let mockNegativePrice: number;
  let mockQuantity: number;

  beforeEach(() => {
    mockQuantity = faker.datatype.number({ min: 1, max: 20 });
    mockOrderItem = new OrderItem(
      faker.datatype.uuid(),
      faker.commerce.product(),
      faker.datatype.float(),
      faker.datatype.uuid(),
      mockQuantity
    );
    mockNegativePrice = faker.datatype.float({ min: -100, max: -1 });
  });

  it('should throw an error if "id" is empty', () => {
    expect(
      () =>
        new OrderItem(
          '',
          faker.commerce.product(),
          faker.datatype.float(),
          faker.datatype.uuid(),
          mockQuantity
        )
    ).toThrowError('id is required.');
  });

  it('should throw an error if "name" is empty', () => {
    expect(
      () =>
        new OrderItem(
          faker.datatype.uuid(),
          '',
          faker.datatype.float(),
          faker.datatype.uuid(),
          mockQuantity
        )
    ).toThrowError('name is required.');
  });

  it('should throw an error if "price" is less than 0', () => {
    expect(
      () =>
        new OrderItem(
          faker.datatype.uuid(),
          faker.commerce.product(),
          mockNegativePrice,
          faker.datatype.uuid(),
          mockQuantity
        )
    ).toThrowError(
      `price must be equal or greater than 0. Current value is ${mockNegativePrice}`
    );
  });
});
