import { EventInterface } from './event.interface';
import { EventHandlerInterface } from './event-handler.interface';
import { EventDispatcherInterface } from './event-dispatcher.interface';

export class EventDispatcher implements EventDispatcherInterface {
  #eventHandlers = new Map<string, Set<EventHandlerInterface>>();

  get eventHandlers() {
    return this.#eventHandlers;
  }

  register(eventName: string, eventHandler: EventHandlerInterface): void {
    this.#eventHandlers.set(
      eventName,
      !this.#eventHandlers.has(eventName)
        ? new Set<EventHandlerInterface>().add(eventHandler)
        : this.#eventHandlers.get(eventName)!.add(eventHandler)
    );
  }

  unRegister(eventName: string): void {
    if (this.#eventHandlers.has(eventName)) {
      this.#eventHandlers.set(eventName, new Set<EventHandlerInterface>());
    }
  }

  unregisterAll(): void {
    this.#eventHandlers.clear();
  }

  notify(event: EventInterface): void {
    const eventName = event.constructor.name;

    if (this.#eventHandlers.has(eventName)) {
      this.#eventHandlers.get(eventName)!.forEach((eventHandler) => {
        eventHandler.handle(event);
      });
    }
  }
}
