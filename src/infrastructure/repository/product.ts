import { Product } from '@/domain/entities';
import { IProductRepository } from '@/domain/repositories';

import { ProductModel } from '../db';

export class ProductRepository implements IProductRepository {
  async create(product: Product): Promise<void> {
    await ProductModel.create({
      id: product.id,
      name: product.name,
      price: product.price,
    });
  }

  async find(id: string): Promise<Product> {
    const result = await ProductModel.findOne({ where: { id } });

    return new Product(
      result?.id as string,
      result?.name as string,
      result?.price as number
    );
  }

  async findAll(): Promise<Product[]> {
    const result = await ProductModel.findAll();

    return result.map(
      (product) => new Product(product.id, product.name, product.price)
    );
  }

  async update(product: Product): Promise<void> {
    await ProductModel.update(
      { name: product.name, price: product.price },
      { where: { id: product.id } }
    );
  }
}
