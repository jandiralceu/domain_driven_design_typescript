import { Sequelize } from 'sequelize-typescript';
import { faker } from '@faker-js/faker';

import { NotFoundError } from '@/domain/errors';
import { CustomerModel } from '@/infrastructure/db';
import { AddressEntity, CustomerEntity, TObject } from '@/domain/entities';

import { CustomerRepository } from './customer';

const DEFAULT_ERROR_MESSAGE = 'Something went wrong, please, try again later.';

describe('CustomerRepository', () => {
  let sequelize: Sequelize;
  let mockCustomer: CustomerEntity;
  let mockCustomerRepository: CustomerRepository;
  let mockErrorMessage: string;

  beforeEach(async () => {
    mockErrorMessage = faker.random.words();
    mockCustomer = new CustomerEntity(
      faker.datatype.uuid(),
      faker.name.findName(),
      new AddressEntity(
        faker.address.street(),
        faker.address.buildingNumber(),
        faker.address.city(),
        faker.address.zipCode('###.##-###')
      )
    );

    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([CustomerModel]);
    await sequelize.sync();

    mockCustomerRepository = new CustomerRepository();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should create a customer', async () => {
    await mockCustomerRepository.create(mockCustomer);

    const result = await CustomerModel.findOne({
      where: { id: mockCustomer.id },
    });

    const customer = CustomerRepository.toCustomerEntity(
      result?.toJSON() as TObject
    );

    expect(customer.isEqual(mockCustomer)).toBe(true);
  });

  it('should throw an error if create customer fails', async () => {
    jest
      .spyOn(CustomerModel, 'create')
      .mockImplementationOnce(() =>
        Promise.reject(new Error(mockErrorMessage))
      );

    await expect(mockCustomerRepository.create(mockCustomer)).rejects.toThrow(
      mockErrorMessage
    );
  });

  it(
    'should throw an error with default error message if create customer' +
      ' fails',
    async () => {
      jest
        .spyOn(CustomerModel, 'create')
        .mockImplementationOnce(() => Promise.reject());

      await expect(mockCustomerRepository.create(mockCustomer)).rejects.toThrow(
        DEFAULT_ERROR_MESSAGE
      );
    }
  );

  it('should update a product', async () => {
    await mockCustomerRepository.create(mockCustomer);
    const customerBeforeUpgrade = mockCustomer.clone();

    mockCustomer.changeName(faker.name.findName());

    await mockCustomerRepository.update(mockCustomer);

    const customerModel = await CustomerModel.findOne({
      where: { id: mockCustomer.id },
    });

    expect(customerModel?.id).toBe(customerBeforeUpgrade.id);
    expect(customerModel?.name).not.toBe(customerBeforeUpgrade.name);
  });

  it('should throw an error if update customer fails', async () => {
    jest
      .spyOn(CustomerModel, 'update')
      .mockImplementationOnce(() =>
        Promise.reject(new Error(mockErrorMessage))
      );

    await expect(mockCustomerRepository.update(mockCustomer)).rejects.toThrow(
      mockErrorMessage
    );
  });

  it('should find a customer', async () => {
    await mockCustomerRepository.create(mockCustomer);

    const foundedCustomer = await mockCustomerRepository.find(mockCustomer.id);

    expect(foundedCustomer.isEqual(mockCustomer)).toBe(true);
  });

  it('should throw an error if find by a invalid customer', async () => {
    await expect(() =>
      mockCustomerRepository.find(faker.datatype.uuid())
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw an error if find by id fails, with a custom message', async () => {
    jest
      .spyOn(CustomerModel, 'findOne')
      .mockImplementationOnce(() =>
        Promise.reject(new Error(mockErrorMessage))
      );

    await expect(mockCustomerRepository.find(mockCustomer.id)).rejects.toThrow(
      mockErrorMessage
    );
  });

  it('should throw an error if find by id fails, with a default message', async () => {
    jest
      .spyOn(CustomerModel, 'findOne')
      .mockImplementationOnce(() => Promise.reject());

    await expect(mockCustomerRepository.find(mockCustomer.id)).rejects.toThrow(
      DEFAULT_ERROR_MESSAGE
    );
  });

  it('should find all customers', async () => {
    const customers = Array.from({ length: 5 }, () => {
      return new CustomerEntity(
        faker.datatype.uuid(),
        faker.commerce.productName(),
        new AddressEntity(
          faker.address.street(),
          faker.address.buildingNumber(),
          faker.address.city(),
          faker.address.zipCode('###.##-###')
        )
      );
    });

    customers.forEach((customer) => {
      mockCustomerRepository.create(customer).then(() => {});
    });

    const foundedCustomers = await mockCustomerRepository.findAll();

    expect(foundedCustomers.sort()).toEqual(customers.sort());
  });

  it('should throw an error if findAll customers fails, with custom message', async () => {
    jest
      .spyOn(CustomerModel, 'findAll')
      .mockImplementationOnce(() =>
        Promise.reject(new Error(mockErrorMessage))
      );

    await expect(mockCustomerRepository.findAll()).rejects.toThrow(
      mockErrorMessage
    );
  });

  it(
    'should throw an error if findAll customers fails, with standard' +
      ' message',
    async () => {
      jest
        .spyOn(CustomerModel, 'findAll')
        .mockImplementationOnce(() => Promise.reject());

      await expect(mockCustomerRepository.findAll()).rejects.toThrow(
        DEFAULT_ERROR_MESSAGE
      );
    }
  );
});
