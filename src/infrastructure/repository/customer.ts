import { Customer, TObject } from '@/domain/entities';
import { ICustomerRepository } from '@/domain/repositories';

import { CustomerModel } from '../db';

export class CustomerRepository implements ICustomerRepository {
  async create(customer: Customer): Promise<void> {
    await CustomerModel.create({
      id: customer.id,
      name: customer.name,
      isActive: customer.isActive,
      rewardPoints: customer.rewardPoints,
      street: customer.address.street,
      streetNumber: customer.address.streetNumber,
      city: customer.address.city,
      zipCode: customer.address.zipCode,
    });
  }

  async find(id: string): Promise<Customer> {
    const result = await CustomerModel.findOne({ where: { id } });

    return Customer.fromJson(result as TObject);
  }

  async findAll(): Promise<Customer[]> {
    const result = await CustomerModel.findAll();
    return result.map(Customer.fromJson);
  }

  async update(customer: Customer): Promise<void> {
    await CustomerModel.update(
      {
        name: customer.name,
        isActive: customer.isActive,
        rewardPoints: customer.rewardPoints,
        street: customer.address.street,
        streetNumber: customer.address.streetNumber,
        city: customer.address.city,
        zipCode: customer.address.zipCode,
      },
      { where: { id: customer.id } }
    );
  }
}
