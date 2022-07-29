import { EventHandlerInterface } from '@/domain/@shared';
import { ProductCreatedEvent } from '@/domain/product';

export class SendEmailWhenProductIsCreated
  implements EventHandlerInterface<ProductCreatedEvent>
{
  handle(event: ProductCreatedEvent): void {
    console.log('Sending email to...');
  }
}
