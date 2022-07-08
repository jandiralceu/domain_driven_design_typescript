import { OrderItem } from "./order_item";

export class Order {
    #id: string;
    #customerId: string;
    #items: OrderItem[];

    constructor(id: string, customerId: string, items: OrderItem[]) {
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

    total(): number {
        return this.#items.reduce((acc, item) => acc + (item.price * item.quantity), 0)
    }

    toString(): string {
        return `ID: ${this.#id}\nCustomerID: ${this.#customerId}\nItems:\n${this.#items.toString()}`;
    }
    
    isEqual(order: Order): boolean {
        return order instanceof Order && this.#id === order.id && this.#customerId === order.customerId && this.#items.length === order.items.length && this.#items.every((item, index) => item.isEqual(order.items[index])); 
    }
}