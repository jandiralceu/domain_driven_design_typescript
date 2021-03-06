import { Validation } from '@/domain/@shared';
import { ValidationError } from '@/domain/@shared/errors';

import { AddressEntity } from '../value_object/address_entity';

export class CustomerEntity {
  #id: string;

  #name: string;

  #address: AddressEntity;

  #isActive: boolean;

  #rewardPoints: number;

  constructor(
    id: string,
    name: string,
    address: AddressEntity,
    isActive = true,
    rewardPoints = 0
  ) {
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
    this.#isActive = isActive;
    this.#rewardPoints = rewardPoints;
  }

  get id(): string {
    return this.#id;
  }

  get name(): string {
    return this.#name;
  }

  get address(): AddressEntity {
    return this.#address;
  }

  get rewardPoints(): number {
    return this.#rewardPoints;
  }

  get isActive(): boolean {
    return this.#isActive;
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

  changeAddress(address: AddressEntity): void {
    this.#validate([
      {
        fieldName: 'address',
        value: address,
        validations: { isRequired: true },
      },
    ]);
    this.#address = address;
  }

  updateRewardPoints(points: number) {
    this.#rewardPoints += points;
  }

  toString(): string {
    return `id: ${this.#id}\nname: ${
      this.#name
    }\naddress: ${this.#address.toString()}\nactive: ${this.isActive.toString()}`;
  }

  clone(): CustomerEntity {
    return new CustomerEntity(
      this.#id,
      this.#name,
      this.#address,
      this.#isActive,
      this.#rewardPoints
    );
  }

  isEqual(customer: CustomerEntity): boolean {
    return (
      this.#id === customer.id &&
      this.#name === customer.name &&
      this.#address.isEqual(customer.address)
    );
  }

  #validate(values: Validation[]): void {
    values.forEach(({ fieldName, value, ...props }) => {
      if (props?.validations?.isRequired) {
        if (typeof value == 'string' || value instanceof AddressEntity) {
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
}
