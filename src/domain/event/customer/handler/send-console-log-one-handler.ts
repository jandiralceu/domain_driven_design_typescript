import { EventHandlerInterface } from '@/domain/event/@shared';
import { CustomerCreatedEvent } from '@/domain/event/customer';

export class SendConsoleLogOneHandler
  implements EventHandlerInterface<CustomerCreatedEvent>
{
  handle(event: CustomerCreatedEvent): void {
    console.log(
      'This is the first console.log from event: CustomerCreatedEvent'
    );
  }
}
