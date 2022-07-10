import { faker } from '@faker-js/faker';

import { Product } from '../entities';
import { ProductService } from './product';

describe('OrderService', () => {
  it('should change the price of all products', () => {
    const products = Array.from({ length: 5 }, () => {
      return new Product(
        faker.datatype.uuid(),
        faker.commerce.productName(),
        faker.datatype.number({ min: 1, max: 50 })
      );
    });

    const productsBeforeUpgrade = products.map((product) => product.clone());

    ProductService.increasePrice(products, 2);

    products.forEach((product, index) => {
      expect(product.price).toBeGreaterThan(productsBeforeUpgrade[index].price);
    });
  });
});
