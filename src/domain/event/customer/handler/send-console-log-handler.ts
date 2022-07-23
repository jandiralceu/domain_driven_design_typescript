import { EventHandlerInterface } from '@/domain/event/@shared';
import { ChangeCustomerAddressEvent } from '@/domain/event/customer';

export class SendConsoleLogHandler
  implements EventHandlerInterface<ChangeCustomerAddressEvent>
{
  handle(event: ChangeCustomerAddressEvent): void {
    console.log(
      `Client address: ${event.eventData.id}, ${
        event.eventData.name
      }\nChanged to: ${event.eventData.address.toString()}`
    );
  }
}
