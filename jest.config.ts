/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/domain/entities/types/**/*',
    '!<rootDir>/src/domain/repositories/**/*',
    '!<rootDir>/src/infrastructure/db/**/*',
    '!<rootDir>/src/**/index.ts'
  ],
  coverageDirectory: 'coverage',
  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
  },
  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: [
    "/node_modules/", "dist"
  ],
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest"],
  },
};
