import { faker } from '@faker-js/faker';

import { Address } from './address';
import { Customer } from './customer';

describe('customer', () => {
  let mockAddress: Address;
  let mockCustomer: Customer;

  beforeEach(() => {
    mockAddress = new Address(
      faker.address.street(),
      faker.address.buildingNumber(),
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

  it('should throw an error if name is less than 4 characters', () => {
    const name = faker.datatype.string(3);
    expect(
      () => new Customer(faker.datatype.uuid(), name, mockAddress)
    ).toThrowError(
      `name length, must be equal or greater than 4. Current length is ${name.length}.`
    );
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

  it('should change address', () => {
    const newAddress = new Address(
      faker.address.street(),
      faker.address.buildingNumber(),
      faker.address.cityName(),
      faker.address.zipCode('###.##-###')
    );

    mockCustomer.changeAddress(newAddress);
    expect(mockCustomer.address.isEqual(newAddress)).toBe(true);
  });

  it('should make an customer copy', () => {
    const newCustomer = mockCustomer.clone();
    expect(mockCustomer.isEqual(newCustomer)).toBe(true);
  });

  it('should return "false" if customers are not equals', () => {
    const newCustomer = new Customer(
      faker.datatype.uuid(),
      faker.name.findName(),
      new Address(
        faker.address.street(),
        faker.address.buildingNumber(),
        faker.address.cityName(),
        faker.address.zipCode('###.##-###')
      )
    );

    expect(mockCustomer.isEqual(newCustomer)).toBe(false);
  });

  it('should return "true" if customers are equals', () => {
    const newCustomer = mockCustomer.clone();

    expect(mockCustomer.isEqual(newCustomer)).toBe(true);
  });

  it('should create a customer instance', () => {
    expect(mockCustomer.toString()).toBe(
      `id: ${mockCustomer.id}\nname: ${
        mockCustomer.name
      }\naddress: ${mockCustomer.address.toString()}\nactive: ${
        mockCustomer.isActive
      }`
    );
  });
});
