import { IMainRepository } from './main';
import { ProductEntity } from '../entities';

export interface IProductRepository extends IMainRepository<ProductEntity> {}
