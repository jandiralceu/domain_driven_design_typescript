import { IMainRepository } from './main';
import { Customer } from '../entities';

export interface ICustomerRepository extends IMainRepository<Customer> {}
