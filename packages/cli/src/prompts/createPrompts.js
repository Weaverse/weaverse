import chalk from 'chalk'
import inquirer from 'inquirer'
import { TEMPLATES } from '../constants/templates.js'
import { validateProjectId, validateProjectName } from '../utils/validation.js'

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
      default: (answers) => {
        let template = answers.template || 'weaverse'
        let timestamp = new Date().toISOString().slice(0, 10)
        return `${template}-project-${timestamp}`
      },
      validate: validateProjectName,
      transformer: (input) => input.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
    })
  }

  return questions
}

/**
 * Prompts user for any missing required options and returns complete configuration
 * @param {Object} argv - Partial command line arguments
 * @returns {Promise<Object>} Complete options object with all required fields
 */
export let promptForMissingOptions = async (argv) => {
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
