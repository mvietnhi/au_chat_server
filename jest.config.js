/* eslint-disable no-undef */
module.exports = {
    preset: 'ts-jest',
    testMatch: ['<rootDir>/tests/index.test.ts'],
    transformignorePatterns: ['/node_modules/(?!deck.gl)'],
    testTimeout: 40000,
  };
  