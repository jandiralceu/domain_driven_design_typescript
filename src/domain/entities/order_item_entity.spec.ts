import { faker } from '@faker-js/faker';

import { OrderItemEntity } from './order_item_entity';

describe('OrderItemEntity', () => {
  let mockOrderItem: OrderItemEntity;
  let mockNegativePrice: number;
  let mockQuantity: number;

  beforeEach(() => {
    mockQuantity = faker.datatype.number({ min: 1, max: 20 });
    mockOrderItem = new OrderItemEntity(
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
        new OrderItemEntity(
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
        new OrderItemEntity(
          faker.datatype.uuid(),
          '',
          faker.datatype.float(),
          faker.datatype.uuid(),
          mockQuantity
        )
    ).toThrowError('name is required.');
  });

  it('should throw an error if "name" length is less than 2', () => {
    const productName = 's';

    expect(
      () =>
        new OrderItemEntity(
          faker.datatype.uuid(),
          productName,
          faker.datatype.float(),
          faker.datatype.uuid(),
          mockQuantity
        )
    ).toThrowError(
      `name length, must be equal or greater than 2. Current length is ${productName.length}.`
    );
  });

  it('should throw an error if "price" is less than 0', () => {
    expect(
      () =>
        new OrderItemEntity(
          faker.datatype.uuid(),
          faker.commerce.product(),
          mockNegativePrice,
          faker.datatype.uuid(),
          mockQuantity
        )
    ).toThrowError(
      `unitPrice must be equal or greater than 0. Current value is ${mockNegativePrice}`
    );
  });

  it('should throw an error if "quantity" is less than 1', () => {
    const quantity = faker.datatype.number({ min: -99, max: 0 });
    expect(
      () =>
        new OrderItemEntity(
          faker.datatype.uuid(),
          faker.commerce.product(),
          faker.datatype.float(),
          faker.datatype.uuid(),
          quantity
        )
    ).toThrowError(
      `quantity must be equal or greater than 1. Current value is ${quantity}`
    );
  });

  it('should throw an error if "productId" is less than 1', () => {
    expect(
      () =>
        new OrderItemEntity(
          faker.datatype.uuid(),
          faker.commerce.product(),
          faker.datatype.float(),
          '',
          mockQuantity
        )
    ).toThrowError('productId is required.');
  });

  it('should return false if order item are different', () => {
    const orderItemToCompare = new OrderItemEntity(
      faker.datatype.uuid(),
      faker.commerce.product(),
      faker.datatype.float(),
      faker.datatype.uuid(),
      mockQuantity
    );

    expect(mockOrderItem.isEqual(orderItemToCompare)).toBe(false);
  });

  it('should return true if order item are equals', () => {
    const orderItemToCompare = mockOrderItem.clone();

    expect(mockOrderItem.isEqual(orderItemToCompare)).toBe(true);
  });

  it(
    'should throw an error if new OrderItem quantity is less than 1' +
      ' characters',
    () => {
      const quantity = faker.datatype.number({ min: -99, max: 0 });

      expect(() => mockOrderItem.updateQuantity(quantity)).toThrowError(
        `quantity must be equal or greater than 1. Current value is ${quantity}.`
      );
      expect(mockOrderItem.quantity).not.toBe(quantity);
    }
  );

  it('should update OrderItem quantity if value is valid', () => {
    const quantity = faker.datatype.number();
    mockOrderItem.updateQuantity(quantity);

    expect(mockOrderItem.quantity).toBe(quantity);
  });

  it('should create a valid OrderItem', () => {
    expect(mockOrderItem.toString()).toBe(
      `id: ${mockOrderItem.id} - name: ${mockOrderItem.name} - price: ${mockOrderItem.price} - quantity: ${mockOrderItem.quantity} - productId: ${mockOrderItem.productId}`
    );
  });

  it(
    'should create a OrderItem with default quantity, if no quantity has' +
      ' passed',
    () => {
      const orderItem = new OrderItemEntity(
        faker.datatype.uuid(),
        faker.commerce.product(),
        faker.datatype.float(),
        faker.datatype.uuid()
      );

      expect(orderItem.quantity).toBe(1);
    }
  );
});
