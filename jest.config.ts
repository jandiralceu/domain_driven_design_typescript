/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  roots: ['<rootDir>/src'],
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/**/*.interface.ts',
    '!<rootDir>/src/domain/entities/types/**/*',
    '!<rootDir>/src/domain/repositories/**/*',
    '!<rootDir>/src/infrastructure/order/**/*',
    '!<rootDir>/src/**/index.ts',
    '!**/commitlint.config.js',
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['/node_modules/', 'dist'],
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
};
