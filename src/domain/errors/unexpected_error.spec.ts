import { faker } from '@faker-js/faker';

import { UnexpectedError } from './unexpected_error';

describe('UnexpectedError', () => {
  it('should create a UnexpectedError', () => {
    const error = new UnexpectedError(faker.random.words());

    expect(error).toBeInstanceOf(UnexpectedError);
  });
});
