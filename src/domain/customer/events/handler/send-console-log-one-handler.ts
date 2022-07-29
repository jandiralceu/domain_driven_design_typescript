import { EventHandlerInterface } from '@/domain/shared/events';
import { CustomerCreatedEvent } from '@/domain/customer/events';

export class SendConsoleLogOneHandler
  implements EventHandlerInterface<CustomerCreatedEvent>
{
  handle(event: CustomerCreatedEvent): void {
    console.log(
      'This is the first console.log from event: CustomerCreatedEvent'
    );
  }
}
