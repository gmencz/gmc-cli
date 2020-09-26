import { promises as fs, existsSync as dirExists } from 'fs'
import { promisify } from 'util'
import ora from 'ora'
import { red, blueBright, underline, white, green, yellow } from 'chalk'
import { exec, ExecException } from 'child_process'
import cliSelect from 'cli-select'
import figures from 'figures'
import { generateDirectoryName } from './utils/generate-directory-name'
import {
  eslintBrowserContent,
  eslintBrowserJestContent,
  eslintNodeContent,
  eslintNodeJestContent,
  gitIgnoreContent,
  huskyrcContent,
  jestConfig,
  lintstagedrcContent,
  prettierrcContent,
  tsconfigBrowser,
  tsconfigNode,
} from './utils/generated-files-content'
import { browserDevDeps, jestDeps, nodeDevDeps } from './utils/deps'

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
    Ask the user if the environment for the project is going to be Node or the browser
  */
  log(
    `${blueBright(figures.pointer)} ${white(
      `What will the environment of this project be?`,
    )}`,
  )

  const { value: environment } = await cliSelect({
    values: ['Node', 'Browser (React)'],
    selected: green(figures.radioOn),
    unselected: white(figures.radioOff),
    indentation: 1,
    valueRenderer: (value, selected) => {
      if (selected) {
        return underline(green(value))
      }

      return value
    },
  })

  log(
    blueBright(
      `${figures.info} Using ${environment} as the environment for this project`,
    ),
  )

  /*
    Install dependencies based on the environment
  */
  const deps: string[] = []
  if (environment === 'Node') {
    deps.push(...nodeDevDeps)
  } else if (environment === 'Browser (React)') {
    deps.push(...browserDevDeps)
  }

  const depsInstallationSpinner = ora(
    white(
      `📦 Installing ${deps.join(', ')}. ${yellow(
        'If any of these dependencies is installed, it will be overwritten with its latest version.',
      )}`,
    ),
  )

  depsInstallationSpinner.start()

  try {
    await execCommand(`npm install -D ${deps.join(' ')}`, {
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
    Ask the user if they want to use Jest
  */
  log(`${blueBright(figures.pointer)} ${white(`Do you wish to set up Jest?`)}`)

  const { value: jestOption } = await cliSelect({
    values: ['Yes', 'No'],
    selected: green(figures.radioOn),
    unselected: white(figures.radioOff),
    indentation: 1,
    valueRenderer: (value, selected) => {
      if (selected) {
        return underline(green(value))
      }

      return value
    },
  })

  const useJest = jestOption === 'Yes'

  if (useJest) {
    /*
      Set up Jest
    */
    const jestSetupSpinner = ora(white(`🤖 Setting up Jest`))
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
      await fs.writeFile(`${directoryName}/jest.config.js`, jestConfig)
    } catch (error) {
      log(
        red(
          `${figures.cross} Something went wrong creating the file jest.config.js`,
        ),
      )
    }
  }

  /*
    Create config files
  */
  const filesSpinner = ora(
    white(
      `📃 Creating config files for typescript, eslint, git, prettier, husky, and lint-staged.`,
    ),
  )
  filesSpinner.start()

  /*
    tsconfig.json
  */
  try {
    await fs.writeFile(
      `${directoryName}/tsconfig.json`,
      environment === 'Browser (React)' ? tsconfigBrowser : tsconfigNode,
    )
  } catch (error) {
    log(
      red(
        `${figures.cross} Something went wrong creating the file tsconfig.json`,
      ),
    )
  }

  // .eslintrc.js
  try {
    await fs.writeFile(
      `${directoryName}/.eslintrc.js`,
      environment === 'Browser (React)'
        ? useJest
          ? eslintBrowserJestContent
          : eslintBrowserContent
        : useJest
        ? eslintNodeJestContent
        : eslintNodeContent,
    )
  } catch (error) {
    log(
      red(
        `${figures.cross} Something went wrong creating the file .eslintrc.js`,
      ),
    )
  }

  // .gitignore
  try {
    await fs.writeFile(`${directoryName}/.gitignore`, gitIgnoreContent)
  } catch (error) {
    log(
      red(`${figures.cross} Something went wrong creating the file .gitignore`),
    )
  }

  // .prettierrc
  try {
    await fs.writeFile(`${directoryName}/.prettierrc`, prettierrcContent)
  } catch (error) {
    log(
      red(
        `${figures.cross} Something went wrong creating the file .prettierrc`,
      ),
    )
  }

  // .huskyrc.js
  try {
    await fs.writeFile(`${directoryName}/.huskyrc.js`, huskyrcContent)
  } catch (error) {
    log(
      red(
        `${figures.cross} Something went wrong creating the file .huskyrc.js`,
      ),
    )
  }

  // .lintstagedrc.js
  try {
    await fs.writeFile(`${directoryName}/.lintstagedrc.js`, lintstagedrcContent)
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
    Create scripts in package.json
    Create file in src/index.ts with some dummy code, create dummy test in /src/__tests__/dummy.test.ts.
    Create README.md
  */
}

process.on('unhandledRejection', () => {
  process.exit(1)
})

run()
