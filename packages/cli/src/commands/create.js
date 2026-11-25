import chalk from 'chalk'
import fs from 'fs-extra'
import { TEMPLATES } from '../constants/templates.js'
import { promptForMissingOptions } from '../prompts/createPrompts.js'
import { downloadAndExtractTemplate } from '../utils/download.js'
import { createEnvFile, toKebabCase } from '../utils/environment.js'
import {
  confirmTargetDirectory,
  ensurePackageManager,
  finishProject,
} from '../utils/project-setup.js'
import {
  validateCommitHash,
  validateProjectName,
  validateWritableDirectory,
} from '../utils/validation.js'
import { createProjectFromPass } from './create-from-pass.js'

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
 * Creates a new Weaverse project from a template, or, with `--pass`, from a
 * licensed partner theme's source (see {@link createProjectFromPass}).
 *
 * Runs fully non-interactively when there's no TTY or `--yes` is passed (so
 * coding agents / CI can drive it): missing `--template` or `--project-id`
 * throws an actionable error instead of hanging, `--project-name` is defaulted,
 * `--force` overwrites an existing folder, and the blocking dev server is only
 * started with `--dev`.
 *
 * @param {Object} argv - Command line arguments object
 * @param {string} [argv.template] - Template name (e.g. 'pilot', 'naturelle', 'aspen', 'maison', 'forward')
 * @param {string} [argv.pass] - One-time install pass for a licensed partner theme
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
    // The project folder goes in the current directory: fail before any
    // prompt or Bun install when it can't be created there.
    let writable = await validateWritableDirectory()
    if (writable !== true) {
      throw new Error(writable)
    }

    if (argv.pass !== undefined) {
      await createProjectFromPass(argv, { nonInteractive })
      return true
    }

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

    // yargs parses `--no-install` as boolean negation (`install: false`), not
    // as a literal `no-install` key — accept both shapes so the flag works.
    let skipInstall = options['no-install'] || options.install === false

    // A Bun template cannot install without Bun: check before downloading so
    // a missing Bun fails fast, before anything is downloaded or an existing
    // folder is overwritten.
    await ensurePackageManager(template, { nonInteractive, skipInstall })

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

    // Overwrite confirmed (via --force or the prompt): clear the directory so
    // the template extracts cleanly instead of colliding with or leaving
    // behind stale files from a previous/partial run.
    if (
      await confirmTargetDirectory(outputPath, {
        nonInteractive,
        force: argv.force,
      })
    ) {
      await fs.emptyDir(outputPath)
    }

    // Create project
    await downloadAndExtractTemplate(template, outputPath, options.commit)
    await createEnvFile(outputPath, options['project-id'], {
      sessionSecret: template.framework === 'hydrogen',
    })

    await finishProject({
      outputPath,
      projectName,
      template,
      skipInstall,
      nonInteractive,
      dev: argv.dev,
    })

    return true
  } catch (error) {
    console.error(chalk.red('\n❌ Error:'), error.message)
    process.exit(1)
  }
}

/** Display names for template frameworks. */
const FRAMEWORK_LABELS = {
  hydrogen: 'Shopify Hydrogen',
  nextjs: 'Next.js',
}

/**
 * Displays the list of available templates with descriptions and usage information
 * @returns {void} Prints template information to console
 */
export let showTemplateList = () => {
  console.log(
    chalk.blue('\nWeaverse CLI - Create a new Weaverse storefront project\n')
  )
  console.log(chalk.gray('Available templates:'))
  for (let template of TEMPLATES) {
    let capitalizedName =
      template.name.charAt(0).toUpperCase() + template.name.slice(1)
    console.log(
      chalk.gray(
        `\n• ${capitalizedName} (${FRAMEWORK_LABELS[template.framework] ?? template.framework})`
      )
    )
    console.log(chalk.gray(`  ${template.description}`))
    console.log(chalk.gray(`  Demo: ${template.demoUrl}`))
  }
  console.log(`
Usage: npx @weaverse/cli create [options]

Options:
  --template <name>     Template name (${TEMPLATES.map((t) => t.name).join(', ')})
  --pass <pass>         Install a licensed partner theme with the one-time pass
                        from your Weaverse dashboard (instead of --template)
  --project-id <id>     Your Weaverse project ID
  --project-name <name> Project folder name (optional)
  --commit <hash>       Git commit hash to use (optional, defaults to main branch)
  --no-install          Don't install dependencies automatically
  --dev                 Start the dev server after install
  --yes, -y             Non-interactive: never prompt; fail on missing required options
  --force, -f           Overwrite the target directory if it already exists
  --help                Show this help message
  --version             Show the CLI version

Non-interactive runs (no TTY, CI, or coding agents) never prompt: pass
--template and --project-id explicitly, and the run fails fast if they're
missing rather than hanging.

Examples:
  npx @weaverse/cli create                                                              # Interactive mode
  npx @weaverse/cli create --template=pilot                                             # Prompt for the rest
  npx @weaverse/cli create --template=pilot --project-id=my-store --project-name=shop   # Full, non-interactive
  npx @weaverse/cli create --pass=<pass> --project-id=my-store                          # Licensed partner theme
  `)
}
