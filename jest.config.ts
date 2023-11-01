const config = {
  testEnvironment: 'jsdom',
  setupFiles: ['./jest.setup.js'],
  transformIgnorePatterns: ['/node_modules/(?!(hex-rgb)/)'],
  moduleNameMapper: {
    '^public/(.*)$': '<rootDir>/public/$1',
    '^styles/(.*)$': '<rootDir>/styles/$1',
    '^utils/(.*)$': '<rootDir>/utils/$1',
    '^config/(.*)$': '<rootDir>/config/$1',
    '^lib/(.*)$': '<rootDir>/lib/$1',
    '^states/(.*)$': '<rootDir>/states/$1',
    '^hooks/(.*)$': '<rootDir>/hooks/$1',
    '^components/(.*)$': '<rootDir>/components/$1',
  },
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testMatch: ['**/tests/**/*.test.ts', '**/tests/**/*.test.tsx'],
}

export default config
