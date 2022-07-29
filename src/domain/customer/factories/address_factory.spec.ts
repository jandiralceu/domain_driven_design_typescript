import { faker } from '@faker-js/faker';

import { AddressFactory } from './address_factory';
import { AddressEntity } from '@/domain/customer';

describe('AddressFactory', () => {
  it('should create a address', () => {
    const address = AddressFactory.create(
      faker.address.street(),
      faker.address.buildingNumber(),
      faker.address.cityName(),
      faker.address.zipCode('###.##-###')
    );

    expect(address).toBeInstanceOf(AddressEntity);
  });
});
