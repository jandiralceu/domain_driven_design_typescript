import { EventHandlerInterface } from '@/domain/shared/events';
import { CustomerCreatedEvent } from '@/domain/customer/events';

export class SendConsoleLogTwoHandler
  implements EventHandlerInterface<CustomerCreatedEvent>
{
  handle(event: CustomerCreatedEvent): void {
    console.log(
      'This is the second console.log from event: CustomerCreatedEvent'
    );
  }
}
