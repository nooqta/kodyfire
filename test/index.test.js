const { beforeAll, afterAll, describe, it, expect } = require('@jest/globals');

/** this code is called once before any test is called */
beforeAll(async () => {
  Object.defineProperty(global, 'document', {});
});

/** this code is called once before all the tested are finished */
afterAll(async () => {});

describe('Strapi in general', () => {
  it('test kodyfire is running', async () => {
    expect(true).toBe(true);
  });
});

require('./packages/kodyfire-cli');
