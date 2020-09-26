const commonDevDeps = [
  '@typescript-eslint/eslint-plugin',
  '@typescript-eslint/parser',
  'eslint',
  'eslint-import-resolver-typescript',
  'eslint-plugin-import',
  'husky',
  'lint-staged',
  'prettier',
  'pretty-quick',
  'typescript',
]

export const jestDeps = ['ts-jest', 'jest', 'eslint-plugin-jest']

export const nodeDevDeps = [...commonDevDeps, '@types/node', 'ts-node-dev']

export const browserDevDeps = [
  ...commonDevDeps,
  '@testing-library/jest-dom',
  '@testing-library/react',
  '@testing-library/user-event',
  'eslint-plugin-jsx-a11y',
  'eslint-plugin-react',
]
