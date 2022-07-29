import { IMainRepository } from '@/domain/@shared';
import { ProductEntity } from '@/domain/product';

export interface IProductRepository extends IMainRepository<ProductEntity> {}
