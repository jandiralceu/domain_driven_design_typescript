import { Customer } from '@/domain/entities';
import { ICustomerRepository } from '@/domain/repositories';

import { CustomerModel } from '../db';
import { NotFound } from '@/domain/errors';

export class CustomerRepository implements ICustomerRepository {
  async create(customer: Customer): Promise<void> {
    try {
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
    } catch (_) {
      throw new Error('Something went wrong, please, try again later.');
    }
  }

  async find(id: string): Promise<Customer> {
    try {
      const result = await CustomerModel.findOne({
        where: { id },
        rejectOnEmpty: true,
      });
      return Customer.fromJson(result);
    } catch (_) {
      throw new NotFound('Customer not found.');
    }
  }

  async findAll(): Promise<Customer[]> {
    try {
      const result = await CustomerModel.findAll();
      return result.map(Customer.fromJson);
    } catch (_) {
      throw new Error('Something went wrong, please, try again later.');
    }
  }

  async update(customer: Customer): Promise<void> {
    try {
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
    } catch (_) {
      throw new Error('Something went wrong, please, try again later.');
    }
  }
}
