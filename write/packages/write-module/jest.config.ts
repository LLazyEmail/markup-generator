/* eslint-disable */
export default {
  displayName: 'write-module',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  testMatch: [
    '<rootDir>/src/**/*.(spec|test).ts',
    '<rootDir>/tests/**/*.(spec|test).ts',
  ],
  coverageDirectory: '../../coverage/packages/write-module',
};
