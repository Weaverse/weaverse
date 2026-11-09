import chalk from 'chalk'
import fs from 'fs-extra'
import inquirer from 'inquirer'
import ora from 'ora'
import { TEMPLATES } from '../constants/templates.js'
import { createEnvFile, toKebabCase } from '../utils/environment.js'
import {
  confirmTargetDirectory,
  ensurePackageManager,
  finishProject,
} from '../utils/project-setup.js'
import {
  detectThemeSetup,
  downloadThemeSource,
  extractThemeSource,
  requestThemeSource,
  resolveApiBase,
  THEME_SOURCE_ERRORS,
  themeHandleErrors,
} from '../utils/theme-source.js'
import { validateProjectId, validateProjectName } from '../utils/validation.js'

const PARTNER_HANDLE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/**
 * The project folder for a name from `--project-name` or the theme handle.
 * @param {string} name
 * @returns {{ projectName: string, outputPath: string }}
 * @throws {Error} When the name can't be a folder/package name
 */
let resolveProjectFolder = (name) => {
  let validation = validateProjectName(name)
  if (validation !== true) {
    throw new Error(validation)
  }
  let projectName = toKebabCase(name.trim())
  return { projectName, outputPath: `./${projectName}` }
}

/**
 * The Weaverse project ID for `.env`: `--project-id` when given (validated),
 * else asked for when someone is there to answer. An empty answer, or a
 * non-interactive run without the flag, leaves it unset (null).
 * @param {Object} argv - Command line arguments object
 * @param {Object} options
 * @param {boolean} options.nonInteractive - Never prompt
 * @param {typeof inquirer.prompt} options.prompt
 * @returns {Promise<string | null>}
 * @throws {Error} When `--project-id` is not a valid project ID
 */
let resolveProjectId = async (argv, { nonInteractive, prompt }) => {
  if (argv['project-id'] !== undefined) {
    let projectId = String(argv['project-id']).trim()
    let validation = validateProjectId(projectId)
    if (validation !== true) {
      throw new Error(validation)
    }
    return projectId
  }
  if (nonInteractive) {
    return null
  }
  let answers = await prompt([
    {
      type: 'input',
      name: 'projectId',
      message:
        'What is your Weaverse project ID? (leave empty to set it in .env later)',
      validate: (input) => !input.trim() || validateProjectId(input),
    },
  ])
  return answers.projectId.trim() || null
}

/**
 * What `create` was asked for: a one-time pass (`--pass`, a licensed theme)
 * or the handle of a free partner theme (`--template=<handle>` that is not a
 * Weaverse template). Checked before any request.
 * @param {Object} argv - Command line arguments object
 * @returns {{ credential: { pass: string } | { handle: string }, errors: Record<string, string>, checking: string, accepted: string, rejected: string }}
 * @throws {Error} On conflicting flags or a malformed value
 */
let resolveCredential = (argv) => {
  if (argv.commit !== undefined) {
    throw new Error(
      '--commit only applies to Weaverse templates, not to partner themes.'
    )
  }
  if (argv.pass !== undefined) {
    if (argv.template !== undefined) {
      throw new Error(
        '--pass installs a licensed partner theme, so it cannot be combined with --template or --commit.'
      )
    }
    let pass = typeof argv.pass === 'string' ? argv.pass.trim() : ''
    if (!pass) {
      throw new Error(
        '--pass needs the one-time pass from your install command. Get the install command from your Weaverse dashboard.'
      )
    }
    return {
      credential: { pass },
      errors: THEME_SOURCE_ERRORS,
      checking: 'Checking your install pass...',
      accepted: 'Install pass accepted',
      rejected: 'Install pass not accepted',
    }
  }
  let handle = String(argv.template).trim()
  let templateNames = TEMPLATES.map((t) => t.name)
  if (!PARTNER_HANDLE.test(handle)) {
    throw new Error(
      `Template '${handle}' not found. Available: ${templateNames.join(', ')}, or the handle of a free partner theme from https://weaverse.io/themes`
    )
  }
  return {
    credential: { handle },
    errors: themeHandleErrors(handle, templateNames),
    checking: `Looking up the partner theme "${handle}"...`,
    accepted: `Found the partner theme "${handle}"`,
    rejected: `Partner theme "${handle}" not available`,
  }
}

/**
 * Creates a project from a partner theme's source: a licensed theme with the
 * one-time install pass from the Weaverse dashboard (`--pass`), or a free
 * partner theme by its handle (`--template=<handle>`).
 *
 * A pass is spent by the first request, so everything that can fail or wait
 * locally (flag conflicts, an explicit `--project-name` folder, the project ID
 * prompt) happens first; a pass lasts 10 minutes. The zip is verified against
 * its SHA-256 before anything is written, and unpacked into the folder named
 * by `--project-name`, or by the theme handle.
 *
 * @param {Object} argv - Command line arguments object
 * @param {string} [argv.pass] - One-time install pass
 * @param {string} [argv.template] - Free partner theme handle (when no pass)
 * @param {string} [argv['api-base']] - Builder origin override (testing)
 * @param {string} [argv['project-id']] - Weaverse project ID for `.env`
 * @param {string} [argv['project-name']] - Project folder name
 * @param {boolean} [argv.force] - Overwrite a non-empty folder without asking
 * @param {boolean} [argv.dev] - Start the dev server after install
 * @param {Object} options
 * @param {boolean} options.nonInteractive - Never prompt
 * @param {typeof fetch} [options.fetch] - HTTP client (tests)
 * @param {typeof inquirer.prompt} [options.prompt] - Prompt (tests)
 * @returns {Promise<void>}
 * @throws {Error} With a user-facing message on any failure
 */
export let createPartnerThemeProject = async (
  argv,
  { nonInteractive, fetch, prompt = inquirer.prompt }
) => {
  let { credential, errors, checking, accepted, rejected } =
    resolveCredential(argv)

  // yargs parses `--no-install` as `install: false`; accept both shapes.
  let skipInstall = argv['no-install'] || argv.install === false
  let apiBase = resolveApiBase(argv)

  // Settle an explicit folder before a pass is spent.
  let folder = null
  let emptyFirst = false
  if (argv['project-name'] !== undefined) {
    folder = resolveProjectFolder(String(argv['project-name']))
    emptyFirst = await confirmTargetDirectory(folder.outputPath, {
      nonInteractive,
      force: argv.force,
    })
  }
  let projectId = await resolveProjectId(argv, { nonInteractive, prompt })

  let spinner = ora(checking).start()
  let source
  try {
    source = await requestThemeSource({ apiBase, credential, errors, fetch })
    spinner.succeed(accepted)
  } catch (error) {
    spinner.fail(rejected)
    throw error
  }

  if (!folder) {
    folder = resolveProjectFolder(source.handle)
    emptyFirst = await confirmTargetDirectory(folder.outputPath, {
      nonInteractive,
      force: argv.force,
    })
  }
  let { projectName, outputPath } = folder

  console.log(chalk.blue('\n🚀 Starting project creation...\n'))
  console.log(chalk.gray('Theme details:'))
  console.log(chalk.gray(`- Theme: ${source.handle}`))
  console.log(chalk.gray(`- Source: ${source.fileName}`))
  console.log(chalk.gray(`- Revision: ${source.revisionId}\n`))

  spinner = ora('Downloading theme source...').start()
  try {
    let zip = await downloadThemeSource({
      url: source.url,
      sha256: source.sha256,
      fetch,
    })
    spinner.text = 'Extracting theme source...'
    if (emptyFirst) {
      await fs.emptyDir(outputPath)
    }
    await extractThemeSource(zip, outputPath)
    spinner.succeed('Theme source downloaded, verified and extracted')
  } catch (error) {
    spinner.fail('Failed to set up the theme source')
    throw error
  }

  let template = {
    name: source.handle,
    framework: 'hydrogen',
    ...(await detectThemeSetup(outputPath)),
    partnerTheme: { hasProjectId: projectId !== null },
  }

  // Always: Hydrogen needs SESSION_SECRET even before the project ID is set.
  await createEnvFile(outputPath, projectId, { sessionSecret: true })

  await ensurePackageManager(template, { nonInteractive, skipInstall })
  await finishProject({
    outputPath,
    projectName,
    template,
    skipInstall,
    nonInteractive,
    dev: argv.dev,
  })
}
