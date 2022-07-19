import { faker } from '@faker-js/faker';

import { AddressEntity } from './address_entity';
import { CustomerEntity } from './customer_entity';

describe('CustomerEntity', () => {
  let mockAddress: AddressEntity;
  let mockCustomer: CustomerEntity;

  beforeEach(() => {
    mockAddress = new AddressEntity(
      faker.address.street(),
      faker.address.buildingNumber(),
      faker.address.cityName(),
      faker.address.zipCode('###.##-###')
    );
    mockCustomer = new CustomerEntity(
      faker.datatype.uuid(),
      faker.name.findName(),
      mockAddress
    );
  });

  it('should throw an error if id is empty', () => {
    expect(
      () => new CustomerEntity('', faker.name.findName(), mockAddress)
    ).toThrowError('id is required.');
  });

  it('should throw an error if name is empty', () => {
    expect(
      () => new CustomerEntity(faker.datatype.uuid(), '', mockAddress)
    ).toThrowError('name is required.');
  });

  it('should throw an error if name is less than 4 characters', () => {
    const name = faker.datatype.string(3);
    expect(
      () => new CustomerEntity(faker.datatype.uuid(), name, mockAddress)
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
    const customer = new CustomerEntity('1', name, mockAddress);

    expect(() => customer.changeName('')).toThrow('name is required.');
    expect(customer.name).toBe(name);
  });

  it('should change address', () => {
    const newAddress = new AddressEntity(
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
    const newCustomer = new CustomerEntity(
      faker.datatype.uuid(),
      faker.name.findName(),
      new AddressEntity(
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

  it('should add reward', () => {
    expect(mockCustomer.rewardPoints).toBe(0);

    const reward = faker.datatype.number();
    mockCustomer.updateRewardPoints(reward);

    expect(mockCustomer.rewardPoints).toBe(reward);
  });
});
