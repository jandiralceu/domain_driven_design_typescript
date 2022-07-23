import { EventHandlerInterface } from '@/domain/event/@shared';
import { CustomerCreatedEvent } from '@/domain/event/customer';

export class SendConsoleLogTwoHandler
  implements EventHandlerInterface<CustomerCreatedEvent>
{
  handle(event: CustomerCreatedEvent): void {
    console.log(
      'This is the second console.log from event: CustomerCreatedEvent'
    );
  }
}
