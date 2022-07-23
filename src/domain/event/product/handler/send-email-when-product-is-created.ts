import { EventHandlerInterface } from '@/domain/event/@shared';
import { ProductCreatedEvent } from '@/domain/event/product';

export class SendEmailWhenProductIsCreated
  implements EventHandlerInterface<ProductCreatedEvent>
{
  handle(event: ProductCreatedEvent): void {
    console.log('Sending email to...');
  }
}
