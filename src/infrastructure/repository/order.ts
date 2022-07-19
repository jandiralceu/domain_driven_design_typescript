import { OrderEntity, OrderItemEntity, TObject } from '@/domain/entities';
import { IOrderRepository } from '@/domain/repositories';
import { OrderItemModel, OrderModel } from '@/infrastructure/db';
import { NotFoundError, UnexpectedError } from '@/domain/errors';

const DEFAULT_ERROR_MESSAGE = 'Something went wrong, please, try again later.';

export class OrderRepository implements IOrderRepository {
  async create(order: OrderEntity): Promise<void> {
    try {
      await OrderModel.create(
        {
          id: order.id,
          total: order.total,
          customer_id: order.customerId,
          items: order.items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.unitPrice,
            quantity: item.quantity,
            product_id: item.productId,
          })),
        },
        { include: [{ model: OrderItemModel }] }
      );
    } catch (error: any) {
      throw new UnexpectedError(error?.message ?? DEFAULT_ERROR_MESSAGE);
    }
  }

  async find(id: string): Promise<OrderEntity> {
    try {
      const result = await OrderModel.findOne({
        where: { id },
        include: [{ model: OrderItemModel }],
        rejectOnEmpty: new NotFoundError('Order not found.'),
      });

      return OrderRepository.toEntity(result);
    } catch (error: any) {
      if (error instanceof NotFoundError) throw error;
      throw new UnexpectedError(error?.message ?? DEFAULT_ERROR_MESSAGE);
    }
  }

  async findAll(): Promise<OrderEntity[]> {
    try {
      const result = await OrderModel.findAll({
        include: [{ model: OrderItemModel }],
      });

      return result.map(OrderRepository.toEntity);
    } catch (error: any) {
      throw new UnexpectedError(error?.message ?? DEFAULT_ERROR_MESSAGE);
    }
  }

  async update(order: OrderEntity): Promise<void> {
    try {
      await OrderModel.update(
        {
          items: order.items,
        },
        { where: { id: order.id } }
      );
    } catch (error: any) {
      throw new UnexpectedError(error?.message ?? DEFAULT_ERROR_MESSAGE);
    }
  }

  static toEntity(json: TObject) {
    return new OrderEntity(
      json.id,
      json.customer_id,
      json.items.map(
        (item: any) =>
          new OrderItemEntity(
            item.id,
            item.name,
            item.price,
            item.product_id,
            item.quantity
          )
      )
    );
  }
}
