import { v4 as uuid } from 'uuid';

import { IProduct, ProductEntity } from '@/domain/product';

export class ProductFactory {
  public static create(id: string, name: string, price: number): IProduct {
    return new ProductEntity(uuid(), name, price);
  }
}
