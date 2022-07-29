import { Sequelize } from 'sequelize-typescript';
import { faker } from '@faker-js/faker';

import { ProductEntity } from '@/domain/product';
import { NotFoundError, UnexpectedError } from '@/domain/@shared';
import { ProductRepository } from './product';
import { ProductModel } from './model';

describe('ProductRepository', () => {
  let sequelize: Sequelize;
  let mockProduct: ProductEntity;
  let mockProductRepository: ProductRepository;

  beforeEach(async () => {
    mockProduct = new ProductEntity(
      faker.datatype.uuid(),
      faker.commerce.productName(),
      faker.datatype.number({ min: 1, max: 500 })
    );

    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([ProductModel]);
    await sequelize.sync();

    mockProductRepository = new ProductRepository();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should throw an error if create product fails', async () => {
    const errorMessage = faker.random.words();

    jest
      .spyOn(ProductModel, 'create')
      .mockImplementationOnce(() => Promise.reject(new Error(errorMessage)));

    await expect(mockProductRepository.create(mockProduct)).rejects.toThrow(
      errorMessage
    );
  });

  it(
    'should throw an error with default system message if create product' +
      ' fails',
    async () => {
      jest
        .spyOn(ProductModel, 'create')
        .mockImplementationOnce(() => Promise.reject());

      await expect(mockProductRepository.create(mockProduct)).rejects.toThrow(
        UnexpectedError
      );
    }
  );

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

  it('should throw an error if update product fails', async () => {
    jest
      .spyOn(ProductModel, 'update')
      .mockImplementationOnce(() => Promise.reject(faker.random.words()));

    await expect(mockProductRepository.update(mockProduct)).rejects.toThrow(
      UnexpectedError
    );
  });

  it('should throw an error if find fails', async () => {
    jest
      .spyOn(ProductModel, 'findOne')
      .mockImplementationOnce(() => Promise.reject(faker.random.words()));

    await expect(mockProductRepository.find(mockProduct.id)).rejects.toThrow(
      UnexpectedError
    );
  });

  it('should throw an error if find by an invalid id product', async () => {
    await expect(
      mockProductRepository.find(faker.datatype.uuid())
    ).rejects.toThrow(NotFoundError);
  });

  it('should find a product', async () => {
    await mockProductRepository.create(mockProduct);

    const foundedProduct = await mockProductRepository.find(mockProduct.id);

    expect(foundedProduct.isEqual(mockProduct)).toStrictEqual(true);
  });

  it('should find all products', async () => {
    const products = Array.from({ length: 5 }, () => {
      return new ProductEntity(
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

  it('should throw an error if findAll fails', async () => {
    jest
      .spyOn(ProductModel, 'findAll')
      .mockImplementationOnce(() => Promise.reject(faker.random.words()));

    await expect(mockProductRepository.findAll()).rejects.toThrow(
      UnexpectedError
    );
  });
});
