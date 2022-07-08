import { faker } from '@faker-js/faker';

import { Address } from './address';
import { Customer } from './customer';

describe('customer', () => {
  let mockAddress: Address;
  let mockCustomer: Customer;

  beforeEach(() => {
    mockAddress = new Address(
      faker.address.street(),
      faker.datatype.number(),
      faker.address.cityName(),
      faker.address.zipCode('###.##-###')
    );
    mockCustomer = new Customer(
      faker.datatype.uuid(),
      faker.name.findName(),
      mockAddress
    );
  });

  it('should throw an error if id is empty', () => {
    expect(
      () => new Customer('', faker.name.findName(), mockAddress)
    ).toThrowError('id is required.');
  });

  it('should throw an error if name is empty', () => {
    expect(
      () => new Customer(faker.datatype.uuid(), '', mockAddress)
    ).toThrowError('name is required.');
  });

  it('should change name', () => {
    const newName = faker.name.findName();
    mockCustomer.changeName(newName);
    expect(mockCustomer.name).toBe(newName);
  });

  it('should throw an error if new name is invalid', () => {
    const name = faker.name.findName();
    const customer = new Customer('1', name, mockAddress);

    expect(() => customer.changeName('')).toThrow('name is required.');
    expect(customer.name).toBe(name);
  });
});
