import { jestDeps, nodeDevDeps } from '../deps'

test('correct dependencies are installed for both jest and node', () => {
  expect(jestDeps).toMatchInlineSnapshot(`
    Array [
      "ts-jest",
      "jest",
      "eslint-plugin-jest",
      "tsconfig-paths-jest",
    ]
  `)

  expect(nodeDevDeps).toMatchInlineSnapshot(`
    Array [
      "@typescript-eslint/eslint-plugin",
      "@typescript-eslint/parser",
      "eslint",
      "eslint-import-resolver-typescript",
      "eslint-plugin-import",
      "husky",
      "lint-staged",
      "prettier",
      "pretty-quick",
      "typescript",
      "@types/node",
      "ts-node-dev",
      "tsconfig-paths",
    ]
  `)
})
