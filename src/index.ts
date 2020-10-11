#!/usr/bin/env node
import { promises as fs, existsSync as dirExists } from 'fs'
import { promisify } from 'util'
import ora from 'ora'
import { red, blueBright, white, yellow, greenBright } from 'chalk'
import { exec, ExecException } from 'child_process'
import figures from 'figures'
import { generateDirectoryName } from './utils/generate-directory-name'
import {
  eslintNodeJestContent,
  gitIgnoreContent,
  huskyrcContent,
  indexContent,
  jestConfig,
  lintstagedrcContent,
  prettierrcContent,
  readmeContent,
  sumTestContent,
  tsconfigNode,
} from './utils/generated-files-content'
import { jestDeps, nodeDevDeps } from './utils/deps'

async function run() {
  const log = console.log
  const args = process.argv.slice(2)
  const directoryNameArg = args[0]
  const execCommand = promisify(exec)

  let directoryName
  if (!directoryNameArg) {
    log(
      blueBright(
        `${figures.info} No directory was specified, one will be created with a generated name`,
      ),
    )

    directoryName = generateDirectoryName()

    /* 
      Make sure the generated directory name doesn't exist in the filesystem.
      If it exists, a new name for the directory will be generated until there
      isn't a directory with the generated name.
    */
    while (dirExists(`./${directoryName}`)) {
      directoryName = generateDirectoryName()
    }
  }

  if (!directoryName) {
    directoryName = directoryNameArg
  }

  let directoryPath = directoryName
  if (directoryName !== '.') {
    /*
      Create directory for the project.
    */
    directoryPath = `./${directoryName}`
    const mkdirSpinner = ora(
      white(`Creating directory with name ${directoryName}`),
    )
    mkdirSpinner.start()
    try {
      await fs.mkdir(directoryPath)
      mkdirSpinner.succeed()
    } catch (error) {
      mkdirSpinner.fail()
      log(
        red(
          `Something went wrong creating a directory for your project, make sure the directory doesn't exist and you have the necessary permissions. If the issue persists you can report this at https://github.com/gmencz/gmc-cli/issues/new`,
        ),
      )
      process.exit(1)
    }
  } else {
    log(
      yellow(
        `${figures.warning} The project will be set up in the current directory and existing files will be overwritten by the generated ones`,
      ),
    )
  }

  /*
    Initialize project with npm init defaults.
  */
  const npmInitSpinner = ora(
    white(`Initializing project with npm init defaults`),
  )
  npmInitSpinner.start()

  try {
    await execCommand('npm init -y', { cwd: directoryPath })
    npmInitSpinner.succeed()
  } catch (error) {
    npmInitSpinner.fail()
    log(
      red(
        `Something went wrong initializing project with npm init defaults:
         Error message: ${(error as ExecException).message}
         Error code: ${(error as ExecException).code}
         Error name ${(error as ExecException).name}`,
      ),
    )
    process.exit(1)
  }

  /*
    Install dependencies
  */
  const depsInstallationSpinner = ora(
    white(
      `📦  Installing ${nodeDevDeps.join(', ')}. ${yellow(
        'If any of these dependencies is installed, it will be overwritten with its latest version.',
      )}`,
    ),
  )

  depsInstallationSpinner.start()

  try {
    await execCommand(`npm install -D ${nodeDevDeps.join(' ')}`, {
      cwd: directoryPath,
    })
    depsInstallationSpinner.succeed()
  } catch (error) {
    depsInstallationSpinner.fail()
    log(
      red(
        `Something went wrong installing the necessary dependencies:
         Error message: ${(error as ExecException).message}
         Error code: ${(error as ExecException).code}
         Error name ${(error as ExecException).name}`,
      ),
    )
    process.exit(1)
  }

  /*
    Set up Jest
  */
  const jestSetupSpinner = ora(white(`🤖  Setting up Jest`))
  jestSetupSpinner.start()

  try {
    await execCommand(`npm install -D ${jestDeps.join(' ')}`, {
      cwd: directoryPath,
    })
    jestSetupSpinner.succeed()
  } catch (error) {
    jestSetupSpinner.fail()
    log(
      red(
        `Something went wrong installing dependencies needed by Jest:
           Error message: ${(error as ExecException).message}
           Error code: ${(error as ExecException).code}
           Error name ${(error as ExecException).name}`,
      ),
    )
    process.exit(1)
  }

  /*
      Create config file for jest
    */
  try {
    await fs.writeFile(`${directoryPath}/jest.config.js`, jestConfig)
  } catch (error) {
    log(
      red(
        `${figures.cross} Something went wrong creating the file jest.config.js`,
      ),
    )
  }

  /*
    Create config files
  */
  const filesSpinner = ora(
    white(
      `📃  Creating config files for typescript, eslint, git, prettier, husky, and lint-staged.`,
    ),
  )
  filesSpinner.start()

  /*
    tsconfig.json
  */
  try {
    await fs.writeFile(`${directoryPath}/tsconfig.json`, tsconfigNode)
  } catch (error) {
    log(
      red(
        `${figures.cross} Something went wrong creating the file tsconfig.json`,
      ),
    )
  }

  // .eslintrc.js
  try {
    await fs.writeFile(`${directoryPath}/.eslintrc.js`, eslintNodeJestContent)
  } catch (error) {
    log(
      red(
        `${figures.cross} Something went wrong creating the file .eslintrc.js`,
      ),
    )
  }

  // .gitignore
  try {
    await fs.writeFile(`${directoryPath}/.gitignore`, gitIgnoreContent)
  } catch (error) {
    log(
      red(`${figures.cross} Something went wrong creating the file .gitignore`),
    )
  }

  // .prettierrc
  try {
    await fs.writeFile(`${directoryPath}/.prettierrc`, prettierrcContent)
  } catch (error) {
    log(
      red(
        `${figures.cross} Something went wrong creating the file .prettierrc`,
      ),
    )
  }

  // .huskyrc.js
  try {
    await fs.writeFile(`${directoryPath}/.huskyrc.js`, huskyrcContent)
  } catch (error) {
    log(
      red(
        `${figures.cross} Something went wrong creating the file .huskyrc.js`,
      ),
    )
  }

  // .lintstagedrc.js
  try {
    await fs.writeFile(`${directoryPath}/.lintstagedrc.js`, lintstagedrcContent)
  } catch (error) {
    log(
      red(
        `${figures.cross} Something went wrong creating the file .lintstagedrc.js`,
      ),
    )
  }

  // Done with creating config files...
  filesSpinner.succeed()

  /*
    TODO: 
    Create README.md
  */

  /*
    Create package.json scripts
  */
  const scriptsSpinner = ora(white(`🤖  Updating package.json scripts`))
  scriptsSpinner.start()

  try {
    const packageJson = JSON.parse(
      await fs.readFile(`${directoryPath}/package.json`, 'utf-8'),
    ) as { scripts: { [script: string]: string } }

    const { scripts } = packageJson

    scripts.test = 'jest'
    scripts['test:watch'] = 'jest --watch'
    scripts.lint = 'eslint --ignore-path .gitignore --ext .js,.ts'
    scripts['check-types'] = 'tsc --noEmit'
    scripts.format = 'pretty-quick'
    scripts.start = 'tsc && node dist/index.js'
    scripts.dev =
      'ts-node-dev -r tsconfig-paths/register --respawn src/index.ts'
    scripts.prettier = `prettier --write '**/*.{ts,js,json,md,graphql}'`

    const updatedPackageJson = { ...packageJson, scripts: { ...scripts } }

    await fs.writeFile(
      `${directoryPath}/package.json`,
      JSON.stringify(updatedPackageJson),
    )
    scriptsSpinner.succeed()
  } catch (error) {
    scriptsSpinner.fail()
    log(
      red(
        `${figures.cross} Something went wrong updating the package.json with the needed scripts.`,
      ),
    )
    process.exit(1)
  }

  /*
    Create example source files
  */
  const exampleSourceFilesSpinner = ora(
    white(`📃  Creating example source files and README`),
  )
  exampleSourceFilesSpinner.start()

  try {
    await fs.mkdir(`${directoryPath}/src`)
    await fs.mkdir(`${directoryPath}/src/__tests__`)
    await fs.writeFile(`${directoryPath}/src/setupTests.ts`, '')
    await fs.writeFile(`${directoryPath}/src/index.ts`, indexContent)

    await fs.writeFile(
      `${directoryPath}/src/__tests__/sum.test.ts`,
      sumTestContent,
    )

    await fs.writeFile(
      `${directoryPath}/README.md`,
      readmeContent(directoryName),
    )

    exampleSourceFilesSpinner.succeed()
  } catch (error) {
    exampleSourceFilesSpinner.fail()
    log(
      red(
        `${figures.cross} Something went wrong creating example source files in src/`,
      ),
    )
  }

  /*
    Format generated files
  */
  try {
    await execCommand('npm run prettier', { cwd: directoryPath })
  } catch (error) {
    log(
      `${figures.info} Generated files couldn't be formatted with the generated prettier config, you may need to format the generated files yourself.`,
    )
  }

  log(greenBright(`\n✨  Happy hacking!\n`))
}

process.on('unhandledRejection', () => {
  process.exit(1)
})

run()
