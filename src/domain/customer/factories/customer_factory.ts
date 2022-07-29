import { v4 as uuid } from 'uuid';
import { AddressEntity, CustomerEntity } from '@/domain/customer';

export class CustomerFactory {
  public static create(name: string, address: AddressEntity): CustomerEntity {
    return new CustomerEntity(uuid(), name, address);
  }
}
