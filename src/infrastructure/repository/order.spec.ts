import { Sequelize } from 'sequelize-typescript';
import { faker } from '@faker-js/faker';

import {
  AddressEntity,
  CustomerEntity,
  OrderEntity,
  OrderItemEntity,
  ProductEntity,
  TObject,
} from '@/domain/entities';
import {
  CustomerRepository,
  OrderRepository,
  ProductRepository,
} from '@/infrastructure/repository';
import {
  CustomerModel,
  OrderItemModel,
  OrderModel,
  ProductModel,
} from '@/infrastructure/db';
import { NotFoundError, UnexpectedError } from '@/domain/errors';

describe('OrderRepository', () => {
  let sequelize: Sequelize;
  let mockOrderRepository: OrderRepository;
  let mockCustomerRepository: CustomerRepository;
  let mockProductRepository: ProductRepository;

  let mockCustomer: CustomerEntity;
  let mockProduct: ProductEntity;
  let mockOrder: OrderEntity;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([
      CustomerModel,
      ProductModel,
      OrderItemModel,
      OrderModel,
    ]);
    await sequelize.sync();

    mockOrderRepository = new OrderRepository();
    mockCustomerRepository = new CustomerRepository();
    mockProductRepository = new ProductRepository();

    mockCustomer = new CustomerEntity(
      faker.datatype.uuid(),
      faker.name.findName(),
      new AddressEntity(
        faker.address.street(),
        faker.address.buildingNumber(),
        faker.address.cityName(),
        faker.address.zipCode('###.##-###')
      )
    );

    mockProduct = new ProductEntity(
      faker.datatype.uuid(),
      faker.commerce.product(),
      faker.datatype.float()
    );

    mockOrder = new OrderEntity(
      faker.datatype.uuid(),
      mockCustomer.id,
      Array.from({ length: faker.datatype.number({ min: 1, max: 3 }) }).map(
        () =>
          new OrderItemEntity(
            faker.datatype.uuid(),
            mockProduct.name,
            mockProduct.price,
            mockProduct.id,
            faker.datatype.number({ min: 1, max: 6 })
          )
      )
    );

    await mockCustomerRepository.create(mockCustomer);
    await mockProductRepository.create(mockProduct);
    await mockOrderRepository.create(mockOrder);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should create a new order', async () => {
    const orderModel = await OrderModel.findOne({
      where: { id: mockOrder.id },
      include: ['items'],
    });

    const savedOrder = OrderRepository.toEntity(
      orderModel?.toJSON() as TObject
    );

    expect(savedOrder.isEqual(mockOrder)).toBe(true);
  });

  it('should throw an error if create order fails', async () => {
    jest
      .spyOn(OrderModel, 'create')
      .mockImplementationOnce(() => Promise.reject(faker.random.words()));

    await expect(mockOrderRepository.create(mockOrder)).rejects.toThrow(
      UnexpectedError
    );
  });

  it('should throw an error if find by an invalid id order', async () => {
    await expect(() =>
      mockOrderRepository.find(faker.datatype.uuid())
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw an error if find by id fails', async () => {
    jest
      .spyOn(OrderModel, 'findOne')
      .mockImplementationOnce(() => Promise.reject(faker.random.words()));

    await expect(mockOrderRepository.find(mockOrder.id)).rejects.toThrow(
      UnexpectedError
    );
  });

  it('should return an order if find by a valid id', async () => {
    const foundedOrder = await mockOrderRepository.find(mockOrder.id);
    expect(foundedOrder.isEqual(mockOrder)).toBe(true);
  });

  it('should find all orders', async () => {
    // add more one product
    const costumer = new CustomerEntity(
      faker.datatype.uuid(),
      faker.name.findName(),
      new AddressEntity(
        faker.address.street(),
        faker.address.buildingNumber(),
        faker.address.cityName(),
        faker.address.zipCode('###.##-###')
      )
    );
    await mockCustomerRepository.create(costumer);

    const product = new ProductEntity(
      faker.datatype.uuid(),
      faker.commerce.product(),
      faker.datatype.float()
    );
    await mockProductRepository.create(product);

    const order = new OrderEntity(
      faker.datatype.uuid(),
      costumer.id,
      Array.from({ length: faker.datatype.number({ min: 1, max: 3 }) }).map(
        () =>
          new OrderItemEntity(
            faker.datatype.uuid(),
            product.name,
            product.price,
            product.id,
            faker.datatype.number({ min: 1, max: 6 })
          )
      )
    );
    await mockOrderRepository.create(order);

    const currentOrders = [mockOrder, order];
    const foundedOrders = await mockOrderRepository.findAll();

    expect(foundedOrders.sort()).toEqual(currentOrders.sort());
  });

  it('should throw an error if findAll fails', async () => {
    jest
      .spyOn(OrderModel, 'findAll')
      .mockImplementationOnce(() => Promise.reject(faker.random.words()));

    await expect(mockOrderRepository.findAll()).rejects.toThrow(
      UnexpectedError
    );
  });

  it('should throw an error of try to update and order with invalid id', async () => {
    const invalidOrder = new OrderEntity(
      faker.datatype.uuid(),
      mockCustomer.id,
      Array.from({ length: faker.datatype.number({ min: 1, max: 3 }) }).map(
        () =>
          new OrderItemEntity(
            faker.datatype.uuid(),
            mockProduct.name,
            mockProduct.price,
            mockProduct.id,
            faker.datatype.number({ min: 1, max: 6 })
          )
      )
    );

    await expect(mockOrderRepository.update(invalidOrder)).rejects.toThrow(
      NotFoundError
    );
  });

  it('should throw an error if update fails', async () => {
    jest
      .spyOn(OrderModel, 'update')
      .mockImplementationOnce(() => Promise.reject(faker.random.words()));

    await expect(mockOrderRepository.update(mockOrder)).rejects.toThrow(
      UnexpectedError
    );
  });

  it('should update an order', async () => {
    mockOrder.addItem(
      new OrderItemEntity(
        faker.datatype.uuid(),
        mockProduct.name,
        mockProduct.price,
        mockProduct.id,
        faker.datatype.number({ min: 1, max: 6 })
      )
    );

    await mockOrderRepository.update(mockOrder);

    const updatedOrder = await mockOrderRepository.find(mockOrder.id);

    expect(updatedOrder.isEqual(mockOrder)).toBe(true);
  });
});
