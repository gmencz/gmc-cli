# gmc-cli

📺 CLI for creating a new Node project with the following tooling set up for you:
- Typescript
- Eslint
- Jest
- Prettier
- Git hooks, only the `pre-commit` hook is set up with `lint-staged` and `husky`.

## Usage

The CLI can be used in three different ways:
- `npx gmc-cli my-awesome-project` will create a folder in the current directory called `my-awesome-project` and set up all modern tooling inside it.
- `npx gmc-cli` will create a folder in the current directory with a randomly generated name and set up all modern tooling inside it.
- `npx gmc-cli .` will set up all modern tooling in the current directory.
