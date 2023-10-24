import nextJest from 'next/jest'

const createJestConfig = nextJest({
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
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

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(customJestConfig)
