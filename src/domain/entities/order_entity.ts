import { OrderItemEntity } from './order_item_entity';
import { Validation } from './types';
import { ValidationError } from '../errors';

export class OrderEntity {
  #id: string;

  #customerId: string;

  #items: OrderItemEntity[];

  constructor(id: string, customerId: string, items: OrderItemEntity[]) {
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

  get items(): OrderItemEntity[] {
    return this.#items;
  }

  get totalItems(): number {
    return this.#items.length;
  }

  get total(): number {
    return this.#items.reduce((acc, item) => acc + item.price, 0);
  }

  addItem(item: OrderItemEntity) {
    this.#items.push(item);
  }

  removeItem(id: string) {
    this.#items = this.#items.filter((item) => item.id !== id);
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

  clone(): OrderEntity {
    return new OrderEntity(
      this.#id,
      this.#customerId,
      this.#items.map(
        (item) =>
          new OrderItemEntity(
            item.id,
            item.name,
            item.unitPrice,
            item.productId,
            item.quantity
          )
      )
    );
  }

  isEqual(order: OrderEntity): boolean {
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
}