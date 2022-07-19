import { IMainRepository } from './main';
import { CustomerEntity } from '../entities';

export interface ICustomerRepository extends IMainRepository<CustomerEntity> {}
