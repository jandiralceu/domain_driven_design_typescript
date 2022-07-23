import { EventInterface } from './event.interface';
import { EventHandlerInterface } from './event-handler.interface';

export interface EventDispatcherInterface {
  unregisterAll(): void;
  notify(event: EventInterface): void;
  register(eventName: string, eventHandler: EventHandlerInterface): void;
  unRegister(eventName: string): void;
}
