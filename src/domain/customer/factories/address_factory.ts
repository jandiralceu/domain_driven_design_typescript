import { AddressEntity } from '@/domain/customer';

export class AddressFactory {
  public static create(
    street: string,
    streetNumber: string,
    city: string,
    zipCode: string
  ): AddressEntity {
    return new AddressEntity(street, streetNumber, city, zipCode);
  }
}
