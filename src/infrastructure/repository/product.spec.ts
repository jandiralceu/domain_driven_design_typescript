import { Sequelize } from 'sequelize-typescript';
import { faker } from '@faker-js/faker';

import { Product } from '@/domain/entities';
import { ProductModel } from '../db';
import { ProductRepository } from './product';

describe('ProductRepository', () => {
  let sequelize: Sequelize;
  let mockProduct: Product;
  let mockProductRepository: ProductRepository;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory',
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([ProductModel]);
    await sequelize.sync();

    mockProduct = new Product(
      faker.datatype.uuid(),
      faker.commerce.productName(),
      faker.datatype.number({ min: 1, max: 500 })
    );
    mockProductRepository = new ProductRepository();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should create a product', async () => {
    await mockProductRepository.create(mockProduct);

    const createdProductModel = await ProductModel.findOne({
      where: { id: mockProduct.id },
    });

    expect(createdProductModel?.toJSON()).toStrictEqual({
      id: mockProduct.id,
      name: mockProduct.name,
      price: mockProduct.price,
    });
  });

  it('should update a product', async () => {
    await mockProductRepository.create(mockProduct);
    const productBeforeUpgrade = mockProduct.clone();

    mockProduct.updateName(faker.commerce.product());
    mockProduct.updatePrice(faker.datatype.number({ min: 1, max: 500 }));

    await mockProductRepository.update(mockProduct);

    const updatedProduct = await ProductModel.findOne({
      where: { id: mockProduct.id },
    });

    expect(updatedProduct?.id).toBe(productBeforeUpgrade.id);
    expect(updatedProduct?.name).not.toBe(productBeforeUpgrade.name);
    expect(updatedProduct?.price).not.toBe(productBeforeUpgrade.price);
  });

  it('should find a product', async () => {
    await mockProductRepository.create(mockProduct);

    const foundedProduct = await mockProductRepository.find(mockProduct.id);

    expect(foundedProduct.isEqual(mockProduct)).toStrictEqual(true);
  });

  it('should find all products', async () => {
    const products = Array.from({ length: 5 }, () => {
      return new Product(
        faker.datatype.uuid(),
        faker.commerce.productName(),
        faker.datatype.number({ min: 1, max: 500 })
      );
    });

    products.forEach((product) => {
      mockProductRepository.create(product).then(() => {});
    });

    const foundedProducts = await mockProductRepository.findAll();

    expect(foundedProducts.sort()).toEqual(products.sort());
  });
});
