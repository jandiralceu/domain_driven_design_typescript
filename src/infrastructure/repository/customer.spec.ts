import { Sequelize } from 'sequelize-typescript';
import { faker } from '@faker-js/faker';

import { Address, Customer, TObject } from '@/domain/entities';
import { CustomerModel } from '../db';
import { CustomerRepository } from './customer';

describe('CustomerRepository', () => {
  let sequelize: Sequelize;
  let mockCustomer: Customer;
  let mockCustomerRepository: CustomerRepository;

  beforeEach(async () => {
    mockCustomer = new Customer(
      faker.datatype.uuid(),
      faker.name.findName(),
      new Address(
        faker.address.street(),
        faker.address.buildingNumber(),
        faker.address.city(),
        faker.address.zipCode('###.##-###')
      )
    );

    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory',
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([CustomerModel]);
    await sequelize.sync();

    mockCustomerRepository = new CustomerRepository();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should create a customer', async () => {
    await mockCustomerRepository.create(mockCustomer);

    const result = await CustomerModel.findOne({
      where: { id: mockCustomer.id },
    });

    const customer = Customer.fromJson(result?.toJSON() as TObject);

    expect(customer.isEqual(mockCustomer)).toBe(true);
  });

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

  it('should find a customer', async () => {
    await mockCustomerRepository.create(mockCustomer);

    const foundedCustomer = await mockCustomerRepository.find(mockCustomer.id);

    expect(foundedCustomer.isEqual(mockCustomer)).toStrictEqual(true);
  });

  it('should throw an error if customer not find', async () => {
    await mockCustomerRepository.create(mockCustomer);

    await expect(() =>
      mockCustomerRepository.find(faker.datatype.uuid())
    ).rejects.toThrow('Customer not found.');
  });

  it('should find all customers', async () => {
    const customers = Array.from({ length: 5 }, () => {
      return new Customer(
        faker.datatype.uuid(),
        faker.commerce.productName(),
        new Address(
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
});
