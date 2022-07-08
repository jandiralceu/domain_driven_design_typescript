import { Address } from "./address"
import { Customer } from "./customer"

describe('customer', () => {
    let address: Address;

    beforeAll(() => {
        address = new Address('Rua Azevedo lima', 198, 'Rio de Janeiro', '0000000');
    });

    it('should throw an error if id is empty', () => {
        expect(() => new Customer("", "John", address)).toThrowError("id is required.");
    });

    it('should throw an error if name is empty', () => {
        expect(() => new Customer("1", "", address)).toThrowError("name is required.");
    });

    it('should change name', () => {
        const customer = new Customer("1", "Jandir Alceu", address);
        customer.changeName("Manuel Cutabiala");
        expect(customer.name).toBe("Manuel Cutabiala");
    });

    it('should throw an error if new name is invalid', () => {
        const customer = new Customer("1", "Jandir Alceu", address);

        expect(() => customer.changeName("")).toThrow('name is required.');
        expect(customer.name).toBe("Jandir Alceu")
    });
})