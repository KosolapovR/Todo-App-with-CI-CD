module.exports = {
  ignorePatterns: [
    '.eslintrc.js',
    'dist/**/*',
    'jest.config.js',
    'webpack.config.js',
  ],
  extends: ['airbnb-typescript', 'prettier'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['prettier', 'react', 'import', '@typescript-eslint'],
  rules: {
    'prettier/prettier': 'error',
    'import/extensions': [
      'error',
      {
        ignorePackages: true,
        js: 'always',
        jsx: 'always',
        ts: 'never',
        tsx: 'never',
        ignore: ['@/**'],
      },
    ],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.test.{ts,tsx}',
          '**/*.spec.{ts,tsx}',
          'src/setupTests.ts',
          'src/mocks/*',
        ],
      },
    ],
  },
};
