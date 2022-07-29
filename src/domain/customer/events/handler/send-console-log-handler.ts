import { EventHandlerInterface } from '@/domain/shared/events';
import { ChangeCustomerAddressEvent } from '@/domain/customer/events';

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
