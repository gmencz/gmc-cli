export const gitIgnoreContent = `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Directory for instrumented libs generated by jscoverage/JSCover
lib-cov

# Coverage directory used by tools like istanbul
coverage

# nyc test coverage
.nyc_output

# Grunt intermediate storage (http://gruntjs.com/creating-plugins#storing-task-files)
.grunt

# Bower dependency directory (https://bower.io/)
bower_components

# node-waf configuration
.lock-wscript

# Compiled binary addons (http://nodejs.org/api/addons.html)
build/Release

# Dependency directories
node_modules/
jspm_packages/

# Typescript v1 declaration files
typings/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# dotenv environment variables file
.env

# gatsby files
.cache/
public

# Mac files
.DS_Store

# Yarn
yarn-error.log
.pnp/
.pnp.js
# Yarn Integrity file
.yarn-integrity
`

export const prettierrcContent = `{
  "arrowParens": "avoid",
  "bracketSpacing": true,
  "htmlWhitespaceSensitivity": "css",
  "insertPragma": false,
  "jsxBracketSameLine": false,
  "jsxSingleQuote": false,
  "printWidth": 80,
  "proseWrap": "always",
  "quoteProps": "as-needed",
  "requirePragma": false,
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "useTabs": false
}
`

export const huskyrcContent = `module.exports = {
  hooks: {
    'pre-commit': 'npm run check-types && lint-staged',
  },
}
`

export const lintstagedrcContent = `module.exports = {
  '*.+(js|ts|tsx)': ['npm run lint', 'jest --bail --findRelatedTests'],
  '*.+(js|json|ts|tsx)': ['npm run format'],
}
`

export const eslintNodeJestContent = `module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:jest/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    'import/order': [
      'error',
      {
        groups: [
          'object',
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
      },
    ],
    'import/no-named-as-default-member': 'off',
    'import/no-named-as-default': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
  },
}`

export const eslintNodeContent = `module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    'import/order': [
      'error',
      {
        groups: [
          'object',
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
      },
    ],
    'import/no-named-as-default-member': 'off',
    'import/no-named-as-default': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
  },
}`

export const jestConfig = `/* eslint-disable @typescript-eslint/no-var-requires */
const tsconfig = require('./tsconfig.json')
// eslint-disable-next-line import/order
const moduleNameMapper = require('tsconfig-paths-jest')(tsconfig)

/* 
  The moduleNameMapper exported by "tsconfig-paths-jest" doesn't match
  only the paths which are exact, for example, if in our tsconfig.json paths we have:
  "utils/*": [...]
  then the moduleNameMapper from jest would apply to everything with utils/*, including
  relative paths such as "../../utils/something" and this can cause issues, so in order
  to fix this, we transform each mapper to start with ^ so it doesn't match relative
  paths and only exact ones.
*/
const exactModuleNameMapper = {}
Object.keys(moduleNameMapper).forEach(glob => {
  exactModuleNameMapper[\`^\${glob}\`] = moduleNameMapper[glob]
})`

export const tsconfigNode = `{
  "compilerOptions": {
    "target": "ESNext",
    "module": "commonjs",
    "lib": ["ESNext"],
    "sourceMap": true,
    "outDir": "dist",
    "moduleResolution": "node",
    "declaration": false,
    "composite": false,
    "removeComments": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitThis": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "skipLibCheck": true,
    "rootDir": "src",
    "baseUrl": ".",
    "paths": {
      "utils/*": ["src/utils/*"],
      "handlers/*": ["src/handlers/*"],
      "routes/*": ["src/routes/*"],
      "schemas/*": ["src/schemas/*"],
      "types/*": ["src/types/*"],
      "src/*": ["src/*"]
    }
  },
  "exclude": ["node_modules"],
  "include": ["./src/**/*.ts"]
}`

export const indexContent = `export const sum = (a: number, b: number): number => a + b`

export const sumTestContent = `import { sum } from '../index'

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3)
})`

export const readmeContent = (projectName: string) => `# ${projectName}

🎉 Project bootstrapped by [gmc-cli](https://github.com/gmencz/gmc-cli)

## Scripts

- \`dev\`: Starts the development version of the project.
- \`start\`: Starts the production version of the project.
- \`test\`: Runs Jest.
- \`test:watch\`: Runs Jest on watch mode.
- \`lint\`: Runs eslint.
- \`check-types\`: Runs the typescript compiler without emiting files (used by pre-commit git hook).
- \`format\`: Runs [pretty-quick](https://github.com/azz/pretty-quick)
- \`prettier\`: Runs prettier on all the project's files.`
