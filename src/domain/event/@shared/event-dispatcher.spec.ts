import { faker } from '@faker-js/faker';

import { ProductCreatedEvent } from '@/domain/event/product';
import { SendEmailWhenProductIsCreated } from '@/domain/event/product/handler';

import { EventDispatcher } from './event-dispatcher';

describe('EventDispatcherInterface - Domain Events Tests', () => {
  let eventDispatcher: EventDispatcher;

  beforeEach(() => {
    eventDispatcher = new EventDispatcher();
  });

  it('should register an event handler', () => {
    const eventHandler = new SendEmailWhenProductIsCreated();

    eventDispatcher.register('ProductCreatedEvent', eventHandler);

    expect(eventDispatcher.eventHandlers.has('ProductCreatedEvent')).toBe(true);
    expect(eventDispatcher.eventHandlers.get('ProductCreatedEvent')?.size).toBe(
      1
    );
    expect(
      eventDispatcher.eventHandlers.get('ProductCreatedEvent')
    ).toMatchObject(eventHandler);
  });

  it('should unregister an event handler', () => {
    const eventHandler = new SendEmailWhenProductIsCreated();

    eventDispatcher.register('ProductCreatedEvent', eventHandler);

    expect(eventDispatcher.eventHandlers.has('ProductCreatedEvent')).toBe(true);

    eventDispatcher.unRegister('ProductCreatedEvent');

    expect(eventDispatcher.eventHandlers.get('ProductCreatedEvent')?.size).toBe(
      0
    );
  });

  it('should unregister all events handlers', () => {
    const eventHandler = new SendEmailWhenProductIsCreated();

    eventDispatcher.register('ProductCreatedEvent', eventHandler);

    expect(eventDispatcher.eventHandlers.has('ProductCreatedEvent')).toBe(true);

    eventDispatcher.unregisterAll();

    expect(eventDispatcher.eventHandlers.size).toBe(0);
  });

  it('should notify all events handlers', () => {
    const eventHandler = new SendEmailWhenProductIsCreated();
    const spyEventHandler = jest.spyOn(eventHandler, 'handle');

    eventDispatcher.register('ProductCreatedEvent', eventHandler);

    expect(eventDispatcher.eventHandlers.has('ProductCreatedEvent')).toBe(true);

    const productCreatedEvent = new ProductCreatedEvent({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.datatype.number({ min: 1, max: 500 }),
    });

    eventDispatcher.notify(productCreatedEvent);

    expect(spyEventHandler).toHaveBeenCalledWith(productCreatedEvent);
  });
});
