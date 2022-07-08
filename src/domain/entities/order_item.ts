export class OrderItem {
    #id: string;
    #name: string;
    #price: number;
    #quantity: number;

    constructor(id: string, name: string, price: number, quantity: number = 1) {
        this.#id = id;
        this.#name = name;
        this.#price = price;
        this.#quantity = quantity;
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

    get quantity(): number {
        return this.#quantity;
    }

    toString(): string {
        return `ID: ${this.#id}\nName: ${this.#name}\nPrice: ${this.#price}\nQuantity: ${this.#quantity}`;
    }

    isEqual(orderItem: OrderItem): boolean {
        return orderItem instanceof OrderItem && this.#id === orderItem.id && this.#name === orderItem.name && this.#price === orderItem.price && this.#quantity === orderItem.quantity;
    }
}
