import { faker } from '@faker-js/faker';
import { ProductEntity } from '@/domain/product';
import { ProductFactory } from './product_factory';

describe('ProductFactory', () => {
  it('should create a product', () => {
    const product = ProductFactory.create(
      faker.datatype.uuid(),
      faker.commerce.product(),
      faker.datatype.float()
    );

    expect(product).toBeInstanceOf(ProductEntity);
  });
});
