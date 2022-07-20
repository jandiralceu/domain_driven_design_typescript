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
import { NotFoundError } from '@/domain/errors';

describe('CustomerRepository', () => {
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
      storage: ':memory',
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
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should create a new order', async () => {
    await mockCustomerRepository.create(mockCustomer);
    await mockProductRepository.create(mockProduct);
    await mockOrderRepository.create(mockOrder);

    const orderModel = await OrderModel.findOne({
      where: { id: mockOrder.id },
      include: ['items'],
    });

    const savedOrder = OrderRepository.toEntity(
      orderModel?.toJSON() as TObject
    );

    expect(savedOrder.isEqual(mockOrder)).toBe(true);
  });

  it('should throw an error if find by an invalid id order', async () => {
    await expect(() =>
      mockOrderRepository.find(faker.datatype.uuid())
    ).rejects.toThrow(NotFoundError);
  });

  it('should return an order if find by a valid id', async () => {
    await mockCustomerRepository.create(mockCustomer);
    await mockProductRepository.create(mockProduct);
    await mockOrderRepository.create(mockOrder);

    const foundedOrder = await mockOrderRepository.find(mockOrder.id);
    expect(foundedOrder.isEqual(mockOrder)).toBe(true);
  });

  it('should find all orders', async () => {
    // Removing the order created by beforeEach hook.
    // await sequelize.truncate();

    await mockCustomerRepository.create(mockCustomer);
    await mockProductRepository.create(mockProduct);
    await mockOrderRepository.create(mockOrder);

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

  it.skip('should update an order', async () => {
    const beforeUpgrade = mockOrder.clone();
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

    expect(updatedOrder).toStrictEqual(beforeUpgrade);
  });
});
