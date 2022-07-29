import { IMainRepository } from '@/domain/@shared';
import { OrderEntity } from '@/domain/checkout';

export interface IOrderRepository extends IMainRepository<OrderEntity> {}
