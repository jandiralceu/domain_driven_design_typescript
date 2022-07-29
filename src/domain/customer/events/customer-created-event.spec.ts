import { faker } from '@faker-js/faker';

import { EventDispatcher } from '@/domain/@shared';
import {
  AddressEntity,
  CustomerEntity,
  SendConsoleLogOneHandler,
  SendConsoleLogTwoHandler,
} from '@/domain/customer';
import { CustomerCreatedEvent } from './customer-created-event';

describe('CustomerCreatedEvent', () => {
  let eventDispatcher: EventDispatcher;
  let firstEventHandler: SendConsoleLogOneHandler;
  let secondEventHandler: SendConsoleLogTwoHandler;

  beforeEach(() => {
    eventDispatcher = new EventDispatcher();

    firstEventHandler = new SendConsoleLogOneHandler();
    secondEventHandler = new SendConsoleLogTwoHandler();
  });

  it('should create an CustomerCreatedEvent', () => {
    const eventData = faker.random.words();
    const customerCreatedEvent = new CustomerCreatedEvent(eventData);

    expect(customerCreatedEvent.eventData).toEqual(eventData);
    expect(customerCreatedEvent.dateAndTimeOccurred).toBeTruthy();
  });

  it('should register CustomerCreatedEvent', () => {
    eventDispatcher.register('CustomerCreatedEvent', firstEventHandler);
    eventDispatcher.register('CustomerCreatedEvent', secondEventHandler);

    expect(eventDispatcher.eventHandlers.has('CustomerCreatedEvent')).toBe(
      true
    );
    expect(
      eventDispatcher.eventHandlers.get('CustomerCreatedEvent')?.size
    ).toBe(2);
    expect(
      eventDispatcher.eventHandlers.get('CustomerCreatedEvent')
    ).toMatchObject(eventDispatcher);
  });

  it('should unregister CustomerCreatedEvent', () => {
    eventDispatcher.register('CustomerCreatedEvent', firstEventHandler);
    eventDispatcher.register('CustomerCreatedEvent', secondEventHandler);

    expect(eventDispatcher.eventHandlers.has('CustomerCreatedEvent')).toBe(
      true
    );

    eventDispatcher.unRegister('CustomerCreatedEvent');

    expect(
      eventDispatcher.eventHandlers.get('CustomerCreatedEvent')?.size
    ).toBe(0);
  });

  it('should notify all events handlers', () => {
    const spyFirstEventHandler = jest.spyOn(firstEventHandler, 'handle');
    const spySecondEventHandler = jest.spyOn(secondEventHandler, 'handle');

    eventDispatcher.register('CustomerCreatedEvent', firstEventHandler);
    eventDispatcher.register('CustomerCreatedEvent', secondEventHandler);

    expect(eventDispatcher.eventHandlers.has('CustomerCreatedEvent')).toBe(
      true
    );

    const customerCreated = new CustomerEntity(
      faker.datatype.uuid(),
      faker.name.findName(),
      new AddressEntity(
        faker.address.street(),
        faker.address.buildingNumber(),
        faker.address.cityName(),
        faker.address.zipCode('###.##-###')
      )
    );

    eventDispatcher.notify(new CustomerCreatedEvent(customerCreated));

    expect(spyFirstEventHandler).toHaveBeenCalledWith(customerCreated);
    expect(spySecondEventHandler).toHaveBeenCalledWith(customerCreated);
  });
});
