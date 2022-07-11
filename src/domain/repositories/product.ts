import { IMainRepository } from './main';
import { Product } from '../entities';

export interface IProductRepository extends IMainRepository<Product> {}
