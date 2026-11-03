import chalk from 'chalk'
import fs from 'fs-extra'
import ora from 'ora'
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
} from '../utils/theme-source.js'
import { validateProjectName } from '../utils/validation.js'

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
 * Creates a project from a licensed partner theme's source, using the one-time
 * install pass from the Weaverse dashboard.
 *
 * The pass is spent by the first request, so everything that can fail locally
 * (flag conflicts, an explicit `--project-name` folder) is checked first. The
 * zip is verified against its SHA-256 before anything is written, and unpacked
 * into the folder named by `--project-name`, or by the theme handle.
 *
 * @param {Object} argv - Command line arguments object
 * @param {string} argv.pass - One-time install pass
 * @param {string} [argv['api-base']] - Builder origin override (testing)
 * @param {string} [argv['project-id']] - Weaverse project ID for `.env`
 * @param {string} [argv['project-name']] - Project folder name
 * @param {boolean} [argv.force] - Overwrite a non-empty folder without asking
 * @param {boolean} [argv.dev] - Start the dev server after install
 * @param {Object} options
 * @param {boolean} options.nonInteractive - Never prompt
 * @param {typeof fetch} [options.fetch] - HTTP client (tests)
 * @returns {Promise<void>}
 * @throws {Error} With a user-facing message on any failure
 */
export let createProjectFromPass = async (argv, { nonInteractive, fetch }) => {
  if (argv.template !== undefined || argv.commit !== undefined) {
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

  // yargs parses `--no-install` as `install: false`; accept both shapes.
  let skipInstall = argv['no-install'] || argv.install === false
  let apiBase = resolveApiBase(argv)

  // Settle an explicit folder before the pass is spent.
  let folder = null
  let emptyFirst = false
  if (argv['project-name'] !== undefined) {
    folder = resolveProjectFolder(String(argv['project-name']))
    emptyFirst = await confirmTargetDirectory(folder.outputPath, {
      nonInteractive,
      force: argv.force,
    })
  }

  let spinner = ora('Checking your install pass...').start()
  let source
  try {
    source = await requestThemeSource({ apiBase, pass, fetch })
    spinner.succeed('Install pass accepted')
  } catch (error) {
    spinner.fail('Install pass not accepted')
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
  }

  if (argv['project-id']) {
    await createEnvFile(outputPath, argv['project-id'], {
      sessionSecret: true,
    })
  } else {
    console.log(
      chalk.yellow(
        `\nNo --project-id given: create ${projectName}/.env from .env.example and set WEAVERSE_PROJECT_ID to your Weaverse project ID.`
      )
    )
  }

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
