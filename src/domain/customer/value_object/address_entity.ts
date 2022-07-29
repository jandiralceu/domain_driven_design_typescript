import { Validation } from '@/domain/@shared';
import { ValidationError } from '@/domain/@shared/errors';

export class AddressEntity {
  #street: string;

  #streetNumber: string;

  #city: string;

  #zipCode: string;

  constructor(
    street: string,
    streetNumber: string,
    city: string,
    zipCode: string
  ) {
    this.#validation([
      { fieldName: 'street', value: street, validations: { isRequired: true } },
      {
        fieldName: 'streetNumber',
        value: streetNumber,
        validations: { isRequired: true },
      },
      {
        fieldName: 'city',
        value: city,
        validations: { isRequired: true },
      },
      {
        fieldName: 'zipCode',
        value: zipCode,
        validations: { isRequired: true },
      },
    ]);

    this.#street = street;
    this.#streetNumber = streetNumber;
    this.#city = city;
    this.#zipCode = zipCode;
  }

  get street(): string {
    return this.#street;
  }

  get streetNumber(): string {
    return this.#streetNumber;
  }

  get city(): string {
    return this.#city;
  }

  get zipCode(): string {
    return this.#zipCode;
  }

  clone(): AddressEntity {
    return new AddressEntity(
      this.#street,
      this.#streetNumber,
      this.#city,
      this.#zipCode
    );
  }

  toString() {
    return `street: ${this.#street} - number: ${this.#streetNumber} - city: ${
      this.#city
    } - ZipCode: ${this.#zipCode}`;
  }

  isEqual(address: AddressEntity) {
    return (
      this.#street === address.street &&
      this.#streetNumber === address.streetNumber &&
      this.#city === address.city &&
      this.#zipCode === address.zipCode
    );
  }

  #validation(values: Validation[]) {
    values.forEach(({ fieldName, value, ...props }) => {
      if (props?.validations?.isRequired) {
        if (typeof value === 'string') {
          if (!value) {
            throw new ValidationError(`${fieldName} is required.`);
          }
        }
      }
    });
  }
}
