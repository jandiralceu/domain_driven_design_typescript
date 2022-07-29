import { ProductEntity } from '@/domain/product';

export class ProductService {
  static increasePrice(products: ProductEntity[], percentage: number): void {
    products.forEach((product) => {
      product.updatePrice((product.price * percentage) / 100 + product.price);
    });
  }
}
