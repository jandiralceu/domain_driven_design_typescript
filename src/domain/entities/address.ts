export class Address {
    #street: string;
    #number: number;
    #city: string;
    #zipCode: string;

    constructor(street: string, streetNumber: number, city: string, zipCode: string) {
        this.#street = street;
        this.#number = streetNumber;
        this.#city = city;
        this.#zipCode = zipCode;

        this.validate();
    }

    get street() {
        return this.#street;
    }

    get streetNumber() {
        return this.#number;
    }
    
    get city() {
        return this.#city;
    }

    get zipCode() {
        return this.#zipCode;
    }

    validate() {
        if (!this.#street) throw new Error('Street is required.');
        if (!this.#number) throw new Error('Street Number is required.');
        if (!this.#city) throw new Error('City is required.');
        if (!this.#zipCode) throw new Error('ZipCode Number is required.');
    }

    toString() {
        return `${this.#street}, ${this.#number}, ${this.#city}, ${this.#zipCode}`;
    }

    isEqual(address: Address) {
        return address instanceof Address && this.#street === address.street && this.#number === address.streetNumber && this.#city === address.city && this.zipCode === address.zipCode;
    }
}