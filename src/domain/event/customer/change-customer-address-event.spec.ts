import { faker } from '@faker-js/faker';

import { ChangeCustomerAddressEvent } from './change-customer-address-event';
import { EventDispatcher } from '@/domain/event/@shared/event-dispatcher';
import { SendConsoleLogHandler } from '@/domain/event/customer/handler';
import { AddressEntity, CustomerEntity } from '@/domain/entities';

describe('ChangeCustomerAddressEvent', () => {
  let eventDispatcher: EventDispatcher;
  let eventHandler: SendConsoleLogHandler;
  let customerWithAddressUpdated: CustomerEntity;

  beforeEach(() => {
    eventDispatcher = new EventDispatcher();
    eventHandler = new SendConsoleLogHandler();

    customerWithAddressUpdated = new CustomerEntity(
      faker.datatype.uuid(),
      faker.name.findName(),
      new AddressEntity(
        faker.address.street(),
        faker.address.buildingNumber(),
        faker.address.cityName(),
        faker.address.zipCode('###.##-###')
      )
    );
  });

  it('should create an ChangeCustomerAddressEvent', () => {
    const eventData = faker.random.words();
    const changeCustomerAddressEvent = new ChangeCustomerAddressEvent(
      eventData
    );

    expect(changeCustomerAddressEvent.eventData).toEqual(eventData);
    expect(changeCustomerAddressEvent.dateAndTimeOccurred).toBeTruthy();
  });

  it('should register ChangeCustomerAddressEvent', () => {
    eventDispatcher.register('ChangeCustomerAddressEvent', eventHandler);

    expect(
      eventDispatcher.eventHandlers.has('ChangeCustomerAddressEvent')
    ).toBe(true);
    expect(
      eventDispatcher.eventHandlers.get('ChangeCustomerAddressEvent')?.size
    ).toBe(1);
    expect(
      eventDispatcher.eventHandlers.get('ChangeCustomerAddressEvent')
    ).toMatchObject(eventDispatcher);
  });

  it('should unregister ChangeCustomerAddressEvent', () => {
    eventDispatcher.register('ChangeCustomerAddressEvent', eventHandler);

    expect(
      eventDispatcher.eventHandlers.has('ChangeCustomerAddressEvent')
    ).toBe(true);

    eventDispatcher.unRegister('ChangeCustomerAddressEvent');

    expect(
      eventDispatcher.eventHandlers.get('ChangeCustomerAddressEvent')?.size
    ).toBe(0);
  });

  it('should notify all events handlers', () => {
    const spyEventHandler = jest.spyOn(eventHandler, 'handle');

    eventDispatcher.register('ChangeCustomerAddressEvent', eventHandler);

    expect(
      eventDispatcher.eventHandlers.has('ChangeCustomerAddressEvent')
    ).toBe(true);

    customerWithAddressUpdated.changeAddress(
      new AddressEntity(
        faker.address.street(),
        faker.address.buildingNumber(),
        faker.address.cityName(),
        faker.address.zipCode('###.##-###')
      )
    );

    eventDispatcher.notify(
      new ChangeCustomerAddressEvent(customerWithAddressUpdated)
    );

    expect(spyEventHandler).toHaveBeenCalledWith(customerWithAddressUpdated);
  });
});
