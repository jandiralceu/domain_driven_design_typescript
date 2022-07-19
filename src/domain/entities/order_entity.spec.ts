import { faker } from '@faker-js/faker';

import { OrderEntity } from './order_entity';
import { OrderItemEntity } from './order_item_entity';

describe('OrderEntity', () => {
  let mockItems: OrderItemEntity[];
  let mockOrder: OrderEntity;

  beforeEach(() => {
    mockItems = Array.from({ length: 3 }, () => {
      return new OrderItemEntity(
        faker.datatype.uuid(),
        faker.commerce.product(),
        faker.datatype.float(),
        faker.datatype.uuid(),
        faker.datatype.number({ min: 1, max: 20 })
      );
    });

    mockOrder = new OrderEntity(
      faker.datatype.uuid(),
      faker.datatype.uuid(),
      mockItems
    );
  });

  it('should throw an error if "id" is empty', () => {
    expect(
      () => new OrderEntity('', faker.datatype.uuid(), mockItems)
    ).toThrowError('id is required.');
  });

  it('should throw an error if "costumerId" is empty', () => {
    expect(
      () => new OrderEntity(faker.datatype.uuid(), '', mockItems)
    ).toThrowError('customerId is required.');
  });

  it('should throw an error if "items" is empty', () => {
    expect(
      () => new OrderEntity(faker.datatype.uuid(), faker.datatype.uuid(), [])
    ).toThrowError('items: add at the least 1 item.');
  });

  it('should return order total', () => {
    const total = mockOrder.items.reduce((acc, item) => acc + item.price, 0);
    expect(mockOrder.total).toBe(total);
  });

  it('should return items quantity', () => {
    expect(mockOrder.totalItems).toBe(mockOrder.items.length);
  });

  it('should return "false" if orders are not equals', () => {
    mockItems = Array.from({ length: 3 }, () => {
      return new OrderItemEntity(
        faker.datatype.uuid(),
        faker.commerce.product(),
        faker.datatype.float(),
        faker.datatype.uuid(),
        faker.datatype.number({ min: 1, max: 20 })
      );
    });

    const order = new OrderEntity(
      faker.datatype.uuid(),
      faker.datatype.uuid(),
      Array.from({ length: 3 }, () => {
        return new OrderItemEntity(
          faker.datatype.uuid(),
          faker.commerce.product(),
          faker.datatype.float(),
          faker.datatype.uuid(),
          faker.datatype.number({ min: 1, max: 20 })
        );
      })
    );
    expect(mockOrder.isEqual(order)).toBe(false);
  });

  it('should return "true" if orders are equals', () => {
    const order = mockOrder.clone();
    expect(mockOrder.isEqual(order)).toBe(true);
  });

  it('should create an order', () => {
    let printItems = '';
    mockOrder.items.forEach((item) => {
      printItems += `${item}\n`;
    });

    expect(mockOrder.toString()).toBe(
      `id: ${mockOrder.id}\ncustomerId: ${mockOrder.customerId}\nitems:\n${printItems}`
    );
  });
});
