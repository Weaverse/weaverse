import chalk from 'chalk'
import fs from 'fs-extra'
import inquirer from 'inquirer'
import { TEMPLATES } from '../constants/templates.js'
import { promptForMissingOptions } from '../prompts/createPrompts.js'
import { downloadAndExtractTemplate } from '../utils/download.js'
import { createEnvFile, toKebabCase } from '../utils/environment.js'
import {
  installDependenciesAndRun,
  runDevServer,
  showManualInstructions,
} from '../utils/install.js'
import {
  checkDirectoryExists,
  validateCommitHash,
  validateProjectName,
} from '../utils/validation.js'

/**
 * Whether to run without any interactive prompts. True when stdin isn't a TTY
 * (piped / CI / launched by a coding agent), or when forced via `--yes`/`--ci`
 * or the `CI` env var. In this mode inquirer is never called.
 * @param {Object} argv - Command line arguments object
 * @returns {boolean}
 */
export let isNonInteractive = (argv = {}) =>
  argv.yes === true ||
  argv.ci === true ||
  !process.stdin.isTTY ||
  process.env.CI === 'true' ||
  process.env.CI === '1'

/**
 * Creates a new Weaverse project from a template.
 *
 * Runs fully non-interactively when there's no TTY or `--yes` is passed (so
 * coding agents / CI can drive it): missing `--template` or `--project-id`
 * throws an actionable error instead of hanging, `--project-name` is defaulted,
 * `--force` overwrites an existing folder, and the blocking dev server is only
 * started with `--dev`.
 *
 * @param {Object} argv - Command line arguments object
 * @param {string} [argv.template] - Template name (e.g. 'pilot', 'naturelle', 'aspen', 'maison')
 * @param {string} [argv['project-id']] - Weaverse project ID
 * @param {string} [argv['project-name']] - Project folder name
 * @param {string} [argv.commit] - Git commit hash (defaults to main branch)
 * @param {boolean} [argv['no-install']] - Skip dependency installation and dev server
 * @param {boolean} [argv.yes] - Force non-interactive mode (never prompt)
 * @param {boolean} [argv.force] - Overwrite the target directory if it exists
 * @param {boolean} [argv.dev] - Start the dev server after install
 * @returns {Promise<boolean>} Resolves true when project creation completes
 */
export let createProject = async (argv) => {
  let nonInteractive = isNonInteractive(argv)

  try {
    // Get complete options, prompting only when interactive
    let options = await promptForMissingOptions(argv, { nonInteractive })

    // Validate commit hash if provided
    if (options.commit) {
      let commitValidation = validateCommitHash(options.commit)
      if (commitValidation !== true) {
        throw new Error(commitValidation)
      }
    }

    // Find the selected template
    let template = TEMPLATES.find((t) => t.name === options.template)
    if (!template) {
      throw new Error(
        `Template '${options.template}' not found. Available: ${TEMPLATES.map(
          (t) => t.name
        ).join(', ')}`
      )
    }

    // Validate the name whether it came from a prompt or a CLI flag —
    // prompts validate inline, but `--project-name` reaches here unchecked
    // and the overwrite path empties `outputPath` (e.g. `--project-name=..`
    // would otherwise point `fs.emptyDir` at the parent directory).
    let nameValidation = validateProjectName(options['project-name'])
    if (nameValidation !== true) {
      throw new Error(nameValidation)
    }

    // Prepare project path
    let projectName = toKebabCase(options['project-name'])
    let outputPath = `./${projectName}`

    // Check if directory already exists
    let directoryCheck = await checkDirectoryExists(outputPath)
    if (directoryCheck.exists && !directoryCheck.isEmpty) {
      if (nonInteractive) {
        if (!argv.force) {
          throw new Error(
            `${directoryCheck.message}. Re-run with --force to overwrite it, or choose a different --project-name.`
          )
        }
      } else {
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
      }

      // Overwrite confirmed (via --force or the prompt): clear the directory so
      // the template extracts cleanly instead of colliding with or leaving
      // behind stale files from a previous/partial run.
      await fs.emptyDir(outputPath)
    }

    // Create project
    await downloadAndExtractTemplate(template, outputPath, options.commit)
    await createEnvFile(outputPath, options['project-id'])

    // Handle installation and dev server
    if (options['no-install']) {
      showManualInstructions(projectName)
    } else {
      await installDependenciesAndRun(outputPath, projectName)

      // Decide whether to start the (long-running, blocking) dev server.
      // Non-interactive only starts it with an explicit --dev, so an agent's
      // `create` returns instead of hanging on a server it can't background.
      let startDev
      if (nonInteractive) {
        startDev = argv.dev === true
      } else {
        ;({ startDev } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'startDev',
            message: 'Would you like to start the development server now?',
            default: argv.dev !== false,
          },
        ]))
      }

      if (startDev) {
        await runDevServer(outputPath)
      } else {
        console.log(chalk.blue('\nTo start the development server, run:'))
        console.log(chalk.gray(`cd ${projectName} && npm run dev\n`))
      }
    }

    return true
  } catch (error) {
    console.error(chalk.red('\n❌ Error:'), error.message)
    process.exit(1)
  }
}

/**
 * Displays the list of available templates with descriptions and usage information
 * @returns {void} Prints template information to console
 */
export let showTemplateList = () => {
  console.log(
    chalk.blue(
      '\nWeaverse CLI - Create a new Weaverse Shopify Hydrogen project\n'
    )
  )
  console.log(chalk.gray('Available templates:'))
  for (let template of TEMPLATES) {
    let capitalizedName =
      template.name.charAt(0).toUpperCase() + template.name.slice(1)
    console.log(chalk.gray(`\n• ${capitalizedName}`))
    console.log(chalk.gray(`  ${template.description}`))
    console.log(chalk.gray(`  Demo: ${template.demoUrl}`))
  }
  console.log(`
Usage: npx @weaverse/cli create [options]

Options:
  --template <name>     Template name (${TEMPLATES.map((t) => t.name).join(', ')})
  --project-id <id>     Your Weaverse project ID
  --project-name <name> Project folder name (optional)
  --commit <hash>       Git commit hash to use (optional, defaults to main branch)
  --no-install          Don't install dependencies automatically
  --dev                 Start the dev server after install
  --yes, -y             Non-interactive: never prompt; fail on missing required options
  --force, -f           Overwrite the target directory if it already exists
  --help                Show this help message

Non-interactive runs (no TTY, CI, or coding agents) never prompt: pass
--template and --project-id explicitly, and the run fails fast if they're
missing rather than hanging.

Examples:
  npx @weaverse/cli create                                                              # Interactive mode
  npx @weaverse/cli create --template=pilot                                             # Prompt for the rest
  npx @weaverse/cli create --template=pilot --project-id=my-store --project-name=shop   # Full, non-interactive
  `)
}
