import chalk from 'chalk'
import inquirer from 'inquirer'
import { TEMPLATES } from '../constants/templates.js'
import { validateProjectId, validateProjectName } from '../utils/validation.js'

/**
 * Default project folder name when one isn't supplied. Kept here so both the
 * interactive prompt default and the non-interactive fallback stay in sync.
 * @param {string} [template] - Selected template name
 * @returns {string} e.g. "pilot-project-2026-06-24"
 */
export let defaultProjectName = (template) => {
  let base = template || 'weaverse'
  let timestamp = new Date().toISOString().slice(0, 10)
  return `${base}-project-${timestamp}`
}

/**
 * Creates an array of inquirer prompt questions for missing CLI options
 * @param {string[]} missingOptions - Array of option names that need to be prompted
 * @returns {Object[]} Array of inquirer question objects
 */
export let createPromptQuestions = (missingOptions) => {
  let questions = []

  if (missingOptions.includes('template')) {
    questions.push({
      type: 'list',
      name: 'template',
      message: 'Which template would you like to use?',
      choices: TEMPLATES.map((template) => ({
        name: `${chalk.cyan(template.name.charAt(0).toUpperCase() + template.name.slice(1))} - ${template.description}`,
        value: template.name,
        short: template.name,
      })),
      pageSize: TEMPLATES.length,
    })
  }

  if (missingOptions.includes('project-id')) {
    questions.push({
      type: 'input',
      name: 'project-id',
      message: 'What is your Weaverse project ID?',
      validate: validateProjectId,
      transformer: (input) => input.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
    })
  }

  if (missingOptions.includes('project-name')) {
    questions.push({
      type: 'input',
      name: 'project-name',
      message: 'What should we name your project folder?',
      default: (answers) => defaultProjectName(answers.template),
      validate: validateProjectName,
      transformer: (input) => input.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
    })
  }

  return questions
}

/**
 * Resolves the complete option set, filling in anything missing.
 *
 * Interactive (a TTY, no `--yes`/`--ci`): prompt for missing values.
 * Non-interactive (piped/CI/agent, or `--yes`): never prompt — `template` and
 * `project-id` are hard-required (throw a clear error listing what's missing so
 * an agent gets an actionable message instead of a hung process), and
 * `project-name` falls back to {@link defaultProjectName}.
 *
 * @param {Object} argv - Partial command line arguments
 * @param {Object} [opts]
 * @param {boolean} [opts.nonInteractive] - Force the no-prompt path
 * @returns {Promise<Object>} Complete options object with all required fields
 */
export let promptForMissingOptions = async (argv, opts = {}) => {
  let nonInteractive = opts.nonInteractive === true
  let missingOptions = []

  if (!argv.template) {
    missingOptions.push('template')
  }
  if (!argv['project-id']) {
    missingOptions.push('project-id')
  }
  if (
    !argv['project-name'] ||
    argv['project-name'] === 'my-weaverse-hydrogen-project'
  ) {
    missingOptions.push('project-name')
  }

  if (missingOptions.length === 0) {
    return argv
  }

  if (nonInteractive) {
    // project-name is the only option we can safely default; everything else is
    // required and must be passed explicitly when there's no one to prompt.
    let required = missingOptions.filter((opt) => opt !== 'project-name')
    if (required.length > 0) {
      throw new Error(
        `Missing required option(s) for a non-interactive run: ${required
          .map((opt) => `--${opt}`)
          .join(', ')}.\n` +
          'Pass them explicitly, e.g.:\n' +
          '  npx @weaverse/cli@latest create --template=pilot --project-id=<your-project-id> --project-name=<folder>'
      )
    }
    return { ...argv, 'project-name': defaultProjectName(argv.template) }
  }

  console.log(chalk.blue("\n🔧 Let's set up your Weaverse project!\n"))

  if (missingOptions.includes('template')) {
    console.log(chalk.gray('Available templates:'))
    for (let template of TEMPLATES) {
      console.log(chalk.gray(`• ${template.name} - ${template.description}`))
      console.log(chalk.gray(`  Demo: ${template.demoUrl}\n`))
    }
  }

  let questions = createPromptQuestions(missingOptions)
  let answers = await inquirer.prompt(questions)

  return { ...argv, ...answers }
}
