import { IMainRepository } from '@/domain/@shared';
import { CustomerEntity } from '@/domain/customer';

export interface ICustomerRepository extends IMainRepository<CustomerEntity> {}
