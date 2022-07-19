import { IMainRepository } from './main';
import { OrderEntity } from '@/domain/entities';

export interface IOrderRepository extends IMainRepository<OrderEntity> {}
