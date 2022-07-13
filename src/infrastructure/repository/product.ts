import { Product } from '@/domain/entities';
import { IProductRepository } from '@/domain/repositories';

import { ProductModel } from '../db';
import { NotFound } from '@/domain/errors';

export class ProductRepository implements IProductRepository {
  async create(product: Product): Promise<void> {
    try {
      await ProductModel.create({
        id: product.id,
        name: product.name,
        price: product.price,
      });
    } catch (_) {
      throw new Error('Something went wrong, please, try again later.');
    }
  }

  async find(id: string): Promise<Product> {
    try {
      const result = await ProductModel.findOne({
        where: { id },
        rejectOnEmpty: true,
      });

      return Product.fromJson(result);
    } catch (_) {
      throw new NotFound('Product not found.');
    }
  }

  async findAll(): Promise<Product[]> {
    try {
      const result = await ProductModel.findAll();
      return result.map(Product.fromJson);
    } catch (_) {
      throw new Error('Something went wrong, please, try again later.');
    }
  }

  async update(product: Product): Promise<void> {
    try {
      await ProductModel.update(
        { name: product.name, price: product.price },
        { where: { id: product.id } }
      );
    } catch (_) {
      throw new Error('Something went wrong, please, try again later.');
    }
  }
}
