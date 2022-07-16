import { Customer } from '@/domain/entities';
import { ICustomerRepository } from '@/domain/repositories';

import { CustomerModel } from '../db';
import { NotFoundError, UnexpectedError } from '@/domain/errors';

const DEFAULT_ERROR_MESSAGE = 'Something went wrong, please, try again later.';

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
    } catch (error: any) {
      throw new UnexpectedError(error?.message ?? DEFAULT_ERROR_MESSAGE);
    }
  }

  async find(id: string): Promise<Customer> {
    try {
      const result = await CustomerModel.findOne({
        where: { id },
        rejectOnEmpty: new NotFoundError('Customer not found.'),
      });
      return Customer.fromJson(result);
    } catch (error: any) {
      if (error instanceof NotFoundError) throw error;
      throw new UnexpectedError(error?.message ?? DEFAULT_ERROR_MESSAGE);
    }
  }

  async findAll(): Promise<Customer[]> {
    try {
      const result = await CustomerModel.findAll();
      return result.map(Customer.fromJson);
    } catch (error: any) {
      throw new UnexpectedError(error?.message ?? DEFAULT_ERROR_MESSAGE);
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
    } catch (error: any) {
      throw new UnexpectedError(error?.message ?? DEFAULT_ERROR_MESSAGE);
    }
  }
}
