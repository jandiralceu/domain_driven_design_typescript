import { faker } from '@faker-js/faker';

import { Product } from './product';

describe('Product', () => {
  let mockProduct: Product;
  let mockNegativePrice: number;

  beforeEach(() => {
    mockProduct = new Product(
      faker.datatype.uuid(),
      faker.commerce.product(),
      faker.datatype.float()
    );
    mockNegativePrice = faker.datatype.float({ min: -100, max: -1 });
  });

  it('should throw an error if id is empty', () => {
    expect(
      () => new Product('', faker.commerce.product(), faker.datatype.float())
    ).toThrowError('id is required.');
  });

  it('should throw an error if name is empty', () => {
    expect(
      () => new Product(faker.datatype.uuid(), '', faker.datatype.float())
    ).toThrowError('name is required.');
  });

  it('should throw an error if name length is less than 2 characters', () => {
    expect(
      () => new Product(faker.datatype.uuid(), 'd', faker.datatype.float())
    ).toThrowError(
      'name length, must be equal or greater than 2. Current length is 1.'
    );
  });

  it('should throw an error if price is less than 0', () => {
    expect(
      () =>
        new Product(
          faker.datatype.uuid(),
          faker.commerce.product(),
          mockNegativePrice
        )
    ).toThrowError(
      `price must be equal or greater than 0. Current value is ${mockNegativePrice}`
    );
  });

  it('should return false if products are different', () => {
    const productToCompare = new Product(
      faker.datatype.uuid(),
      faker.commerce.product(),
      faker.datatype.float()
    );

    expect(mockProduct.isEqual(productToCompare)).toBe(false);
  });

  it('should return true if products are equals', () => {
    const productToCompare = mockProduct.clone();

    expect(mockProduct.isEqual(productToCompare)).toBe(true);
  });

  it('should throw an error if new product price is less than zero', () => {
    expect(() => mockProduct.updatePrice(mockNegativePrice)).toThrowError(
      `price must be equal or greater than 0. Current value is ${mockNegativePrice}`
    );
    expect(mockProduct.price).not.toBe(mockNegativePrice);
  });

  it('should update price if value is valid', () => {
    const price = faker.datatype.float();
    mockProduct.updatePrice(price);

    expect(mockProduct.price).toBe(price);
  });

  it('should throw an error if new product name is empty', () => {
    const name = '';

    expect(() => mockProduct.updateName(name)).toThrowError(
      'name is required.'
    );
    expect(mockProduct.price).not.toBe(name);
  });

  it('should throw an error if new product name has less than to 2 characters', () => {
    const name = 't';

    expect(() => mockProduct.updateName(name)).toThrowError(
      'name length, must be equal or greater than 2. Current length is 1.'
    );
    expect(mockProduct.price).not.toBe(name);
  });

  it('should update product name if value is valid', () => {
    const name = faker.commerce.product();
    mockProduct.updateName(name);

    expect(mockProduct.name).toBe(name);
  });

  it('should create a valid product', () => {
    expect(mockProduct.toString()).toBe(
      `id: ${mockProduct.id} - name: ${mockProduct.name} - price: ${mockProduct.price}`
    );
  });
});
