import { faker } from '@faker-js/faker';

import { ProductCreatedEvent } from './product-created-event';

describe('ProductCreatedEvent', () => {
  it('should create a ProductCreatedEvent', () => {
    const eventData = {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.datatype.number({ min: 1, max: 500 }),
    };
    const productCreatedEvent = new ProductCreatedEvent(eventData);

    expect(productCreatedEvent.eventData).toEqual(eventData);
    expect(productCreatedEvent.dateAndTimeOccurred).toBeInstanceOf(Date);
  });
});
