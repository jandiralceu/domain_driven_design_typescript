import { faker } from '@faker-js/faker';

import { Address } from './address';

describe('Address', () => {
  let mockAddress: Address;
  beforeEach(() => {
    mockAddress = new Address(
      faker.address.street(),
      faker.address.buildingNumber(),
      faker.address.city(),
      faker.address.zipCode('###.##-###')
    );
  });

  it('should throw an error if "id" is empty', () => {
    expect(
      () =>
        new Address(
          '',
          faker.address.buildingNumber(),
          faker.address.city(),
          faker.address.zipCode('###.##-###')
        )
    ).toThrowError('street is required.');
  });

  it('should throw an error if "streetNumber" is empty', () => {
    expect(
      () =>
        new Address(
          faker.address.street(),
          '',
          faker.address.city(),
          faker.address.zipCode('###.##-###')
        )
    ).toThrowError('streetNumber is required.');
  });

  it('should throw an error if "city" is empty', () => {
    expect(
      () =>
        new Address(
          faker.address.street(),
          faker.address.buildingNumber(),
          '',
          faker.address.zipCode('###.##-###')
        )
    ).toThrowError('city is required.');
  });

  it('should throw an error if "zipCode" is empty', () => {
    expect(
      () =>
        new Address(
          faker.address.street(),
          faker.address.buildingNumber(),
          faker.address.city(),
          ''
        )
    ).toThrowError('zipCode is required.');
  });

  it('should return false if Addresses are different', () => {
    const address = new Address(
      faker.address.street(),
      faker.address.buildingNumber(),
      faker.address.city(),
      faker.address.zipCode('###.##-###')
    );

    expect(mockAddress.isEqual(address)).toBe(false);
  });

  it('should return true if Addresses are equals', () => {
    const address = mockAddress.clone();

    expect(mockAddress.isEqual(address)).toBe(true);
  });

  it('should create a valid Address instance', () => {
    expect(mockAddress.toString()).toBe(
      `street: ${mockAddress.street} - number: ${mockAddress.streetNumber} - city: ${mockAddress.city} - ZipCode: ${mockAddress.zipCode}`
    );
  });
});
