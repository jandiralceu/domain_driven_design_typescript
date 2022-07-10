import { Product } from '../entities';

export class ProductService {
  static increasePrice(products: Product[], percentage: number): void {
    products.forEach((product) => {
      product.updatePrice((product.price * percentage) / 100 + product.price);
    });
  }
}
