import chalk from 'chalk'
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
} from '../utils/validation.js'

export let createProject = async (argv) => {
  try {
    // Get complete options with prompts for missing values
    let options = await promptForMissingOptions(argv)

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
      throw new Error(`Template '${options.template}' not found`)
    }

    // Prepare project path
    let projectName = toKebabCase(options['project-name'])
    let outputPath = `./${projectName}`

    // Check if directory already exists
    let directoryCheck = await checkDirectoryExists(outputPath)
    if (directoryCheck.exists && !directoryCheck.isEmpty) {
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

    // Create project
    await downloadAndExtractTemplate(template, outputPath, options.commit)
    await createEnvFile(outputPath, options['project-id'])

    // Handle installation and dev server
    if (options['no-install']) {
      showManualInstructions(projectName)
    } else {
      await installDependenciesAndRun(outputPath, projectName)

      // Ask if user wants to start dev server
      let { startDev } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'startDev',
          message: 'Would you like to start the development server now?',
          default: true,
        },
      ])

      if (startDev) {
        await runDevServer(outputPath)
      } else {
        console.log(chalk.blue('\nTo start the development server later, run:'))
        console.log(chalk.gray(`cd ${projectName} && npm run dev\n`))
      }
    }

    return true
  } catch (error) {
    console.error(chalk.red('\n❌ Error:'), error.message)
    process.exit(1)
  }
}

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
  --help                Show this help message

Examples:
  npx @weaverse/cli create                           # Interactive mode
  npx @weaverse/cli create --template=pilot         # Prompt for missing options
  npx @weaverse/cli create --template=pilot --project-id=my-store  # Full command
  `)
}
