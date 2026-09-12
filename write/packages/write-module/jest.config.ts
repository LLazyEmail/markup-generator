import type { Config } from 'jest';

const config: Config = {
  displayName: 'markup-generator',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          target: 'ES2020',
          module: 'commonjs',
          esModuleInterop: true,
          strict: true,
          types: ['jest', 'node'],
        },
      },
    ],
  },
  moduleFileExtensions: ['ts', 'js'],
  testMatch: ['<rootDir>/src/**/*.(spec|test).ts', '<rootDir>/tests/**/*.(spec|test).ts'],
};

export default config;
