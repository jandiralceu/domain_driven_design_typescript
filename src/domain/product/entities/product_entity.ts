import { Validation } from '@/domain/@shared';
import { ValidationError } from '@/domain/@shared/errors';
import { IProduct } from './product.interface';

export class ProductEntity implements IProduct {
  #id: string;

  #name: string;

  #price: number;

  constructor(id: string, name: string, price: number) {
    this.#validation([
      { fieldName: 'id', value: id, validations: { isRequired: true } },
      {
        fieldName: 'name',
        value: name,
        validations: { isRequired: true, minLength: 2 },
      },
      { fieldName: 'price', value: price, validations: { minLength: 0 } },
    ]);
    this.#id = id;
    this.#name = name;
    this.#price = price;
  }

  get id(): string {
    return this.#id;
  }

  get name(): string {
    return this.#name;
  }

  get price(): number {
    return this.#price;
  }

  updatePrice(price: number): void {
    this.#validation([
      { fieldName: 'price', value: price, validations: { minLength: 0 } },
    ]);

    this.#price = price;
  }

  updateName(name: string): void {
    this.#validation([
      {
        fieldName: 'name',
        value: name,
        validations: { isRequired: true, minLength: 2 },
      },
    ]);

    this.#name = name;
  }

  clone(): ProductEntity {
    return new ProductEntity(this.#id, this.#name, this.#price);
  }

  toString(): string {
    return `id: ${this.#id} - name: ${this.#name} - price: ${this.#price}`;
  }

  isEqual(product: ProductEntity): boolean {
    return (
      this.#id === product.id &&
      this.#name === product.name &&
      this.#price === product.price
    );
  }

  #validation(values: Validation[]) {
    values.forEach(({ fieldName, value, ...props }) => {
      if (props?.validations?.isRequired) {
        if (typeof value === 'string') {
          if (!value) {
            throw new ValidationError(
              `${fieldName.toLowerCase()} is required.`
            );
          }
        }
      }

      if (typeof props?.validations?.minLength === 'number') {
        if (
          typeof value === 'string' &&
          value.length < props?.validations?.minLength
        ) {
          throw new ValidationError(
            `${fieldName.toLowerCase()} length, must be equal or greater than ${
              props.validations.minLength
            }. Current length is ${value.length}.`
          );
        }

        if (
          typeof value === 'number' &&
          value < props?.validations?.minLength
        ) {
          // eslint-disable-next-line max-len
          throw new ValidationError(
            `${fieldName.toLowerCase()} must be equal or greater than ${
              props.validations.minLength
            }. Current value is ${value}.`
          );
        }
      }
    });
  }
}
