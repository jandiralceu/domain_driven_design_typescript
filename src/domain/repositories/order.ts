import { IMainRepository } from './main';
import { Order } from '../entities';

export interface IOrderRepository extends IMainRepository<Order> {}
