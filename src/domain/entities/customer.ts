import { ValidationError } from "../errors/validation_error";
import { Address } from "./address";

export class Customer {
  #id: string;
  #name: string;
  #address: Address;

  constructor(id: string, name: string, address: Address) {
    this.validate({ id, name, address });
    
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
    return true;
  }

  validate(values: { [key: string]: any}): void {
    for (let [key, value] of Object.entries(values)) {
      if (typeof value === 'string') {
        if (!value) throw new ValidationError(`${key} is required.`)
      }

      if (value instanceof Address) {
        if (!value) throw new ValidationError(`${key} is required.`)
      }
    }
  }

  changeName(name: string): void {
    this.validate({ name });
    this.#name = name;
  }

  changeAddress(address: Address): void {
    this.validate({ address });
    this.#address = address;
  }

  toString(): string {
    return `Name: ${this.#name} \n Address: ${this.#address.toString()} \n Active: ${this.isActive.toString()}`
  }

  isEqual(customer: Customer): boolean {
    return customer instanceof Customer && this.#id === customer.id && this.#name === customer.name && this.#address.isEqual(customer.address);
  }
}
