import { faker } from '@faker-js/faker';

import { NotFoundError } from './not_found_error';

describe('NotFoundError', () => {
  it('should create a NotFoundError', () => {
    const error = new NotFoundError(faker.random.words());

    expect(error).toBeInstanceOf(NotFoundError);
  });
});
