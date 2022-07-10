import { ValidationError } from '../errors';
import { Validation } from './types';
import { Address } from './address';

type CopyCustomerProps = {
  id?: string;
  name?: string;
  address?: Address;
  isActive?: boolean;
};

export class Customer {
  #id: string;

  #name: string;

  #address: Address;

  #isActive = true;

  constructor(id: string, name: string, address: Address) {
    this.#validate([
      { fieldName: 'id', value: id, validations: { isRequired: true } },
      {
        fieldName: 'name',
        value: name,
        validations: { isRequired: true, minLength: 4 },
      },
      {
        fieldName: 'address',
        value: address,
        validations: { isRequired: true },
      },
    ]);

    this.#id = id;
    this.#name = name;
    this.#address = address;
  }

  get id(): string {
    return this.#id;
  }

  get name(): string {
    return this.#name;
  }

  get address(): Address {
    return this.#address;
  }

  get isActive(): boolean {
    return this.#isActive;
  }

  #validate(values: Validation[]): void {
    values.forEach(({ fieldName, value, ...props }) => {
      if (props?.validations?.isRequired) {
        if (typeof value == 'string' || value instanceof Address) {
          if (!value) {
            throw new ValidationError(
              `${fieldName.toLowerCase()} is required.`
            );
          }
        }
      }

      if (
        props?.validations?.minLength &&
        value.length < props?.validations?.minLength
      ) {
        if (typeof value == 'string') {
          throw new ValidationError(
            `${fieldName.toLowerCase()} length, must be equal or greater than ${
              props.validations.minLength
            }. Current length is ${value.length}.`
          );
        }
      }
    });
  }

  changeName(name: string): void {
    this.#validate([
      {
        value: name,
        fieldName: 'name',
        validations: { isRequired: true, minLength: 4 },
      },
    ]);
    this.#name = name;
  }

  changeAddress(address: Address): void {
    this.#validate([
      {
        fieldName: 'address',
        value: address,
        validations: { isRequired: true },
      },
    ]);
    this.#address = address;
  }

  toString(): string {
    return `id: ${this.#id}\nname: ${
      this.#name
    }\naddress: ${this.#address.toString()}\nactive: ${this.isActive.toString()}`;
  }

  clone(): Customer {
    return new Customer(this.#id, this.#name, this.#address);
  }

  isEqual(customer: Customer): boolean {
    return (
      this.#id === customer.id &&
      this.#name === customer.name &&
      this.#address.isEqual(customer.address)
    );
  }
}
