import { EventInterface } from '@/domain/@shared';

export class ChangeCustomerAddressEvent implements EventInterface {
  #dateAndTimeOccurred: Date;

  #eventData: any;

  constructor(eventData: any) {
    this.#dateAndTimeOccurred = new Date();
    this.#eventData = eventData;
  }

  get eventData() {
    return this.#eventData;
  }

  get dateAndTimeOccurred() {
    return this.#dateAndTimeOccurred;
  }
}
