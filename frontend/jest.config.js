module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(ts|tsx|js)',
    '<rootDir>/src/**/*.(test|spec).(ts|tsx|js)',
  ],
  testEnvironmentOptions: {
    customExportConditions: ['msw'],
  },
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 80,
      lines: 80,
      statemen: 80,
    },
  },
  coveragePathIgnorePatterns: [
    '<rootDir>/src/mocks/',
    '<rootDir>/node_modules/',
  ],
};
