import { OrderItem } from './order_item';
import { TObject, Validation } from './types';
import { ValidationError } from '../errors';

export class Order {
  #id: string;

  #customerId: string;

  #items: OrderItem[];

  constructor(id: string, customerId: string, items: OrderItem[]) {
    this.#validation([
      { fieldName: 'id', value: id, validations: { isRequired: true } },
      {
        fieldName: 'customerId',
        value: customerId,
        validations: { isRequired: true },
      },
      {
        fieldName: 'items',
        value: items,
        validations: { minLength: 1 },
      },
    ]);

    this.#id = id;
    this.#customerId = customerId;
    this.#items = items;
  }

  get id(): string {
    return this.#id;
  }

  get customerId(): string {
    return this.#customerId;
  }

  get items(): OrderItem[] {
    return this.#items;
  }

  get totalItems(): number {
    return this.#items.length;
  }

  get total(): number {
    return this.#items.reduce((acc, item) => acc + item.price, 0);
  }

  toString(): string {
    let printItems = '';
    this.#items.forEach((item) => {
      printItems += `${item}\n`;
    });

    return `id: ${this.#id}\ncustomerId: ${
      this.#customerId
    }\nitems:\n${printItems}`;
  }

  clone(): Order {
    return new Order(this.#id, this.#customerId, this.#items);
  }

  isEqual(order: Order): boolean {
    return (
      this.#id === order.id &&
      this.#customerId === order.customerId &&
      this.totalItems === order.totalItems &&
      this.#items.every((orderItem, index) =>
        orderItem.isEqual(order.items[index])
      )
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

      if (props?.validations?.minLength) {
        if (Array.isArray(value)) {
          if (value.length < 1) {
            throw new ValidationError(`${fieldName}: add at the least 1 item.`);
          }
        }
      }
    });
  }

  static toJson(json: TObject) {
    return new Order(
      json.id,
      json.customer_id,
      json.items.map(OrderItem.toJson)
    );
  }
}
