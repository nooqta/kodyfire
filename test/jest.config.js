'use strict';

module.exports = {
  testEnvironment: 'jsdom',
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
      diagnostics: false,
    },
  },
  testMatch: ['<rootDir>/**/*.test.js'],
  testPathIgnorePatterns: ['/src/', 'node_modules'],
  // Jest transformations -- this adds support for TypeScript
  // using ts-jest
  preset: 'ts-jest',
  transform: {
    '^.+\\.[t|j]sx?$': 'ts-jest',
  },
};
