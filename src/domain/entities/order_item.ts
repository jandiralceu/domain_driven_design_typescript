import { ValidationError } from '../errors';
import { Validation } from './types';

export class OrderItem {
  #id: string;

  #name: string;

  #price: number;

  #quantity: number;

  #productId: string;

  constructor(
    id: string,
    name: string,
    price: number,
    productId: string,
    quantity = 1
  ) {
    this.#validation([
      { fieldName: 'id', value: id, validations: { isRequired: true } },
      {
        fieldName: 'name',
        value: name,
        validations: { isRequired: true, minLength: 2 },
      },
      { fieldName: 'price', value: price, validations: { minLength: 0 } },
      {
        fieldName: 'productId',
        value: quantity,
        validations: { isRequired: true },
      },
      { fieldName: 'quantity', value: quantity, validations: { minLength: 1 } },
    ]);
    this.#id = id;
    this.#name = name;
    this.#price = price;
    this.#quantity = quantity;
    this.#productId = productId;
  }

  get id(): string {
    return this.#id;
  }

  get name(): string {
    return this.#name;
  }

  get price(): number {
    return this.#price * this.#quantity;
  }

  get quantity(): number {
    return this.#quantity;
  }

  get productId(): string {
    return this.#productId;
  }

  #validation(values: Validation[]) {
    values.forEach(({ fieldName, value, ...props }) => {
      if (props?.validations?.isRequired) {
        if (typeof value == 'string') {
          if (!value) {
            throw new ValidationError(
              `${fieldName.toLowerCase()} is required.`
            );
          }
        }
      }

      if (typeof props?.validations?.minLength == 'number') {
        if (
          typeof value == 'string' &&
          value.length < props?.validations?.minLength
        ) {
          throw new ValidationError(
            `${fieldName.toLowerCase()} length, must be equal or greater than ${
              props.validations.minLength
            }. Current length is ${value.length}.`
          );
        }

        if (typeof value == 'number' && value < props?.validations?.minLength) {
          throw new ValidationError(
            `${fieldName.toLowerCase()} must be equal or greater than ${
              props.validations.minLength
            }. Current value is ${value}.`
          );
        }
      }
    });
  }

  toString(): string {
    return `id: ${this.#id} - name: ${this.#name} - price: ${
      this.#price
    } - quantity: ${this.#quantity} - productId: ${this.#productId}`;
  }

  isEqual(orderItem: OrderItem): boolean {
    return (
      this.#id === orderItem.id &&
      this.#name === orderItem.name &&
      this.#price === orderItem.price &&
      this.#quantity === orderItem.quantity
    );
  }
}
