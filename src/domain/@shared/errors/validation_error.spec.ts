import { faker } from '@faker-js/faker';

import { ValidationError } from './validation_error';

describe('ValidationError', () => {
  it('should create a ValidationError', () => {
    const error = new ValidationError(faker.random.words());

    expect(error).toBeInstanceOf(ValidationError);
  });
});
