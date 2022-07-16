import { Sequelize } from 'sequelize-typescript';
import { faker } from '@faker-js/faker';

import {
  Address,
  Customer,
  Order,
  OrderItem,
  Product,
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

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory',
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();

    mockOrderRepository = new OrderRepository();
    mockCustomerRepository = new CustomerRepository();
    mockProductRepository = new ProductRepository();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should create a new order', async () => {
    const customer = new Customer(
      faker.datatype.uuid(),
      faker.name.findName(),
      new Address(
        faker.address.street(),
        faker.address.buildingNumber(),
        faker.address.cityName(),
        faker.address.zipCode('###.##-###')
      )
    );

    const product = new Product(
      faker.datatype.uuid(),
      faker.commerce.product(),
      faker.datatype.float()
    );

    await mockCustomerRepository.create(customer);
    await mockProductRepository.create(product);

    const orderItem = new OrderItem(
      faker.datatype.uuid(),
      product.name,
      product.price,
      product.id,
      faker.datatype.number({ min: 1, max: 6 })
    );

    const order = new Order(faker.datatype.uuid(), customer.id, [orderItem]);

    await mockOrderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ['items'],
    });
    const savedOrder = Order.fromJson(orderModel?.toJSON() as TObject);

    expect(savedOrder.isEqual(order)).toBe(true);
  });

  it('should throw an error if find by an invalid order', async () => {
    await expect(() =>
      mockOrderRepository.find(faker.datatype.uuid())
    ).rejects.toThrow(NotFoundError);
  });

  it.skip('should return an order', () => {});
});
