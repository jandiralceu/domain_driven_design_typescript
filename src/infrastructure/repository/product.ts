import { Product } from '@/domain/entities';
import { IProductRepository } from '@/domain/repositories';

import { ProductModel } from '../db';
import { NotFoundError, UnexpectedError } from '@/domain/errors';

const DEFAULT_ERROR_MESSAGE = 'Something went wrong, please, try again later.';

export class ProductRepository implements IProductRepository {
  async create(product: Product): Promise<void> {
    try {
      await ProductModel.create({
        id: product.id,
        name: product.name,
        price: product.price,
      });
    } catch (error: any) {
      throw new UnexpectedError(error?.message ?? DEFAULT_ERROR_MESSAGE);
    }
  }

  async find(id: string): Promise<Product> {
    try {
      const result = await ProductModel.findOne({
        where: { id },
        rejectOnEmpty: new NotFoundError('Product not found.'),
      });

      return Product.fromJson(result);
    } catch (error: any) {
      if (error instanceof NotFoundError) throw error;
      throw new UnexpectedError(error?.message ?? DEFAULT_ERROR_MESSAGE);
    }
  }

  async findAll(): Promise<Product[]> {
    try {
      const result = await ProductModel.findAll();
      return result.map(Product.fromJson);
    } catch (error: any) {
      throw new UnexpectedError(error?.message ?? DEFAULT_ERROR_MESSAGE);
    }
  }

  async update(product: Product): Promise<void> {
    try {
      await ProductModel.update(
        { name: product.name, price: product.price },
        { where: { id: product.id } }
      );
    } catch (error: any) {
      throw new UnexpectedError(error?.message ?? DEFAULT_ERROR_MESSAGE);
    }
  }
}
