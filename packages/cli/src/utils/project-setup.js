import chalk from 'chalk'
import inquirer from 'inquirer'
import { ensureBun } from './bun.js'
import {
  getDevCommand,
  installDependenciesAndRun,
  runDevServer,
  showManualInstructions,
} from './install.js'
import { checkDirectoryExists } from './validation.js'

/**
 * Asks before a project lands in a non-empty folder. Non-interactive runs
 * need `--force`; interactive runs prompt and exit when declined. Nothing is
 * deleted here, so the caller can empty the folder only once it is about to
 * write into it.
 * @param {string} outputPath - Target project directory
 * @param {Object} options
 * @param {boolean} options.nonInteractive - No one to ask
 * @param {boolean} [options.force] - `--force` was passed
 * @returns {Promise<boolean>} True when the folder exists and must be emptied
 */
export let confirmTargetDirectory = async (
  outputPath,
  { nonInteractive, force }
) => {
  let directoryCheck = await checkDirectoryExists(outputPath)
  if (!directoryCheck.exists || directoryCheck.isEmpty) {
    return false
  }

  if (nonInteractive) {
    if (!force) {
      throw new Error(
        `${directoryCheck.message}. Re-run with --force to overwrite it, or choose a different --project-name.`
      )
    }
    return true
  }

  let { overwrite } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'overwrite',
      message: `${directoryCheck.message}. Do you want to overwrite it?`,
      default: false,
    },
  ])
  if (!overwrite) {
    console.log(chalk.yellow('\nProject creation cancelled.'))
    process.exit(0)
  }
  return true
}

/**
 * Makes sure the project's package manager is available before installing.
 * Only Bun can be missing: npm ships with the Node running the CLI.
 * @param {Object} template - Template configuration object
 * @param {Object} options
 * @param {boolean} options.nonInteractive - No one to ask
 * @param {boolean} options.skipInstall - Dependencies won't be installed
 * @returns {Promise<void>}
 */
export let ensurePackageManager = async (
  template,
  { nonInteractive, skipInstall }
) => {
  if (skipInstall || template.packageManager !== 'bun') {
    return
  }
  await ensureBun({
    nonInteractive,
    confirm: async () => {
      let { installBun } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'installBun',
          message:
            'This template requires Bun, which is not installed. Install it now with `npm install -g bun`?',
          default: true,
        },
      ])
      return installBun
    },
  })
}

/**
 * Installs dependencies and optionally starts the dev server, or prints the
 * manual steps when install is skipped.
 * @param {Object} options
 * @param {string} options.outputPath - Project directory
 * @param {string} options.projectName - Project folder name, for messages
 * @param {Object} options.template - Template configuration object
 * @param {boolean} options.skipInstall - `--no-install`
 * @param {boolean} options.nonInteractive - No one to ask
 * @param {boolean} [options.dev] - `--dev` / `--no-dev`
 * @returns {Promise<void>}
 */
export let finishProject = async ({
  outputPath,
  projectName,
  template,
  skipInstall,
  nonInteractive,
  dev,
}) => {
  if (skipInstall) {
    showManualInstructions(projectName, template)
    return
  }

  await installDependenciesAndRun(outputPath, projectName, template)

  // Decide whether to start the (long-running, blocking) dev server.
  // Non-interactive only starts it with an explicit --dev, so an agent's
  // `create` returns instead of hanging on a server it can't background.
  let startDev
  if (nonInteractive) {
    startDev = dev === true
  } else {
    ;({ startDev } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'startDev',
        message: 'Would you like to start the development server now?',
        default: dev !== false,
      },
    ]))
  }

  if (startDev) {
    await runDevServer(outputPath, template)
  } else {
    console.log(chalk.blue('\nTo start the development server, run:'))
    console.log(chalk.gray(`cd ${projectName} && ${getDevCommand(template)}\n`))
  }
}
