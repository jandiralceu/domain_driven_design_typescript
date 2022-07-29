import { OrderEntity, OrderItemEntity } from '@/domain/checkout';

export type OrderFactoryProps = {
  id: string;
  customerId: string;
  items: {
    id: string;
    name: string;
    productId: string;
    quantity: number;
    price: number;
  }[];
};

export class OrderFactory {
  public static create({
    id,
    customerId,
    items,
  }: OrderFactoryProps): OrderEntity {
    return new OrderEntity(
      id,
      customerId,
      items.map(
        (item) =>
          new OrderItemEntity(
            item.id,
            item.name,
            item.price,
            item.productId,
            item.quantity
          )
      )
    );
  }
}
