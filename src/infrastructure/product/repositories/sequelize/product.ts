import { ProductModel } from './model';
import { IProductRepository, ProductEntity } from '@/domain/product';
import { NotFoundError, TObject, UnexpectedError } from '@/domain/@shared';

const DEFAULT_ERROR_MESSAGE = 'Something went wrong, please, try again later.';

export class ProductRepository implements IProductRepository {
  async create(product: ProductEntity): Promise<void> {
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

  async find(id: string): Promise<ProductEntity> {
    try {
      const result = await ProductModel.findOne({
        where: { id },
        rejectOnEmpty: new NotFoundError('Product not found.'),
      });

      return ProductRepository.toProductEntity(result);
    } catch (error: any) {
      if (error instanceof NotFoundError) throw error;
      throw new UnexpectedError(error?.message ?? DEFAULT_ERROR_MESSAGE);
    }
  }

  async findAll(): Promise<ProductEntity[]> {
    try {
      const result = await ProductModel.findAll();
      return result.map(ProductRepository.toProductEntity);
    } catch (error: any) {
      throw new UnexpectedError(error?.message ?? DEFAULT_ERROR_MESSAGE);
    }
  }

  async update(product: ProductEntity): Promise<void> {
    try {
      await ProductModel.update(
        { name: product.name, price: product.price },
        { where: { id: product.id } }
      );
    } catch (error: any) {
      throw new UnexpectedError(error?.message ?? DEFAULT_ERROR_MESSAGE);
    }
  }

  static toProductEntity(json: TObject) {
    return new ProductEntity(json.id, json.name, json.price);
  }
}
