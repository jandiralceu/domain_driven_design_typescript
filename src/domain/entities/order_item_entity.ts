import { ValidationError } from '../errors';
import { TObject, Validation } from './types';

export class OrderItemEntity {
  #id: string;

  #name: string;

  #unitPrice: number;

  #quantity: number;

  #productId: string;

  constructor(
    id: string,
    name: string,
    unitPrice: number,
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
      {
        fieldName: 'unitPrice',
        value: unitPrice,
        validations: { minLength: 0 },
      },
      {
        fieldName: 'productId',
        value: productId,
        validations: { isRequired: true },
      },
      { fieldName: 'quantity', value: quantity, validations: { minLength: 1 } },
    ]);

    this.#id = id;
    this.#name = name;
    this.#unitPrice = unitPrice;
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
    return this.#unitPrice * this.#quantity;
  }

  get unitPrice(): number {
    return this.#unitPrice;
  }

  get quantity(): number {
    return this.#quantity;
  }

  get productId(): string {
    return this.#productId;
  }

  updateQuantity(quantity: number) {
    this.#validation([
      { fieldName: 'quantity', value: quantity, validations: { minLength: 1 } },
    ]);

    this.#quantity = quantity;
  }

  clone(): OrderItemEntity {
    return new OrderItemEntity(
      this.#id,
      this.#name,
      this.#unitPrice,
      this.#productId,
      this.#quantity
    );
  }

  toString(): string {
    return `id: ${this.#id} - name: ${this.#name} - price: ${
      this.price
    } - quantity: ${this.#quantity} - productId: ${this.#productId}`;
  }

  isEqual(orderItem: OrderItemEntity): boolean {
    return (
      this.#id === orderItem.id &&
      this.#name === orderItem.name &&
      this.price === orderItem.price &&
      this.#quantity === orderItem.quantity &&
      this.#productId === orderItem.productId
    );
  }

  #validation(values: Validation[]) {
    values.forEach(({ fieldName, value, ...props }) => {
      if (props?.validations?.isRequired) {
        if (typeof value == 'string') {
          if (!value) {
            throw new ValidationError(`${fieldName} is required.`);
          }
        }
      }

      if (typeof props?.validations?.minLength == 'number') {
        if (
          typeof value == 'string' &&
          value.length < props?.validations?.minLength
        ) {
          throw new ValidationError(
            `${fieldName} length, must be equal or greater than ${props.validations.minLength}. Current length is ${value.length}.`
          );
        }

        if (typeof value == 'number' && value < props?.validations?.minLength) {
          throw new ValidationError(
            `${fieldName} must be equal or greater than ${props.validations.minLength}. Current value is ${value}.`
          );
        }
      }
    });
  }
}
