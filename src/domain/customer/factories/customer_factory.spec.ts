import { faker } from '@faker-js/faker';

import { CustomerFactory } from './customer_factory';
import { AddressFactory } from '@/domain/customer/factories/address_factory';
import { AddressEntity, CustomerEntity } from '@/domain/customer';

describe('CustomerFactory', () => {
  it('should create a customer', () => {
    const customer = CustomerFactory.create(
      faker.name.findName(),
      AddressFactory.create(
        faker.address.street(),
        faker.address.buildingNumber(),
        faker.address.cityName(),
        faker.address.zipCode('###.##-###')
      )
    );

    expect(customer).toBeInstanceOf(CustomerEntity);
    expect(customer.address).toBeInstanceOf(AddressEntity);
  });
});
