export class NotFound extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, NotFound.prototype);
  }
}
