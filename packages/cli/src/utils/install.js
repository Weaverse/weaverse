import chalk from 'chalk'
import spawn from 'cross-spawn'
import fs from 'fs-extra'
import ora from 'ora'

/**
 * The dependency install command for a template's package manager.
 * @param {Object} template - Template configuration object
 * @returns {{ command: string, args: string[] }}
 */
export let getInstallCommand = (template) =>
  template.packageManager === 'bun'
    ? { command: 'bun', args: ['install'] }
    : { command: 'npm', args: ['install', '--legacy-peer-deps'] }

/**
 * The command that starts a template's dev server, e.g. `bun run dev`.
 * @param {Object} template - Template configuration object
 * @returns {string}
 */
export let getDevCommand = (template) => `${template.packageManager} run dev`

/**
 * The next-step lines printed after a project is created.
 * @param {string} projectName - The project folder name
 * @param {Object} template - Template configuration object
 * @param {Object} [options]
 * @param {boolean} [options.installed=true] - Whether dependencies are installed
 * @returns {string[]} Lines to print, in order
 */
export let getNextSteps = (
  projectName,
  template,
  { installed = true } = {}
) => {
  let steps = [`cd ${projectName}`]
  if (!installed) {
    steps.push(`${template.packageManager} install`)
  }

  if (template.framework === 'nextjs') {
    steps.push(
      'Add your Shopify Storefront API keys to .env: PUBLIC_STORE_DOMAIN, PRIVATE_STOREFRONT_API_TOKEN and PUBLIC_STOREFRONT_API_TOKEN',
      getDevCommand(template),
      `Open http://localhost:${template.devPort} and connect it in Weaverse Studio`
    )
    return [
      ...steps.map((step, index) => `${index + 1}. ${step}`),
      '',
      'This theme runs against a real Shopify store, so it needs the keys before it starts.',
      'Get them from the Headless sales channel (https://apps.shopify.com/headless).',
      'Guide: https://weaverse.io/docs/nextjs/quickstart',
    ]
  }

  steps.push(
    getDevCommand(template),
    `Open http://localhost:${template.devPort} in your browser`
  )
  return [
    ...steps.map((step, index) => `${index + 1}. ${step}`),
    '',
    'The demo store works out of the box. To connect your own Shopify store later:',
    '- Store on a Shopify plan: install the Hydrogen sales channel (https://apps.shopify.com/hydrogen),',
    '  create a Hydrogen storefront, then run: npx shopify hydrogen env pull',
    '- Development store: install the Headless sales channel (https://apps.shopify.com/headless)',
    '  and copy the Storefront API values into .env',
  ]
}

/**
 * Prints the success banner and next steps.
 * @param {string} projectName - The project folder name
 * @param {Object} template - Template configuration object
 * @param {Object} [options]
 * @param {boolean} [options.installed=true] - Whether dependencies are installed
 * @returns {void}
 */
export let printNextSteps = (projectName, template, options) => {
  console.log(chalk.green('\n🎉 Project created successfully!'))
  console.log(chalk.blue('\nNext steps:'))
  for (let line of getNextSteps(projectName, template, options)) {
    console.log(chalk.gray(line))
  }
  console.log('')
}

/**
 * Installs dependencies for a newly created project and displays next steps
 * @param {string} outputPath - The project directory path
 * @param {string} projectName - The project name for display purposes
 * @param {Object} template - Template configuration object
 * @returns {Promise<boolean>} True if installation succeeds
 * @throws {Error} If the install command fails
 */
export let installDependenciesAndRun = async (
  outputPath,
  projectName,
  template
) => {
  let spinner = ora('Installing dependencies...').start()
  let { command, args } = getInstallCommand(template)

  try {
    if (command === 'npm') {
      // remove the package-lock.json, it not necessary
      await fs.remove(`${outputPath}/package-lock.json`).catch(console.error)
    }

    let installPromise = new Promise((resolve, reject) => {
      let install = spawn(command, args, {
        cwd: outputPath,
        stdio: 'pipe', // Change to 'pipe' to capture output
      })

      install.on('close', (installCode) => {
        if (installCode === 0) {
          resolve()
        } else {
          reject(
            new Error(`${command} ${args[0]} exited with code ${installCode}`)
          )
        }
      })

      install.on('error', (error) => {
        reject(error)
      })
    })

    await installPromise
    spinner.succeed('Dependencies installed successfully')

    printNextSteps(projectName, template)

    return true
  } catch (error) {
    spinner.fail('Failed to install dependencies')
    throw error
  }
}

/**
 * Starts the development server for a newly created project
 * @param {string} outputPath - The project directory path
 * @param {Object} template - Template configuration object
 * @returns {void} Starts the dev server process
 */
export let runDevServer = (outputPath, template) => {
  console.log(chalk.blue('Starting development server...\n'))

  let devCommand = getDevCommand(template)
  let runDev = spawn(template.packageManager, ['run', 'dev'], {
    cwd: outputPath,
    stdio: 'inherit',
  })

  runDev.on('close', (runDevCode) => {
    if (runDevCode !== 0) {
      console.error(chalk.red(`${devCommand} exited with code ${runDevCode}`))
    }
  })

  runDev.on('error', (error) => {
    console.error(
      chalk.red('Failed to start development server:'),
      error.message
    )
  })
}

/**
 * Displays manual setup instructions when automatic installation is skipped
 * @param {string} projectName - The project name for display in instructions
 * @param {Object} template - Template configuration object
 * @returns {void} Prints setup instructions to console
 */
export let showManualInstructions = (projectName, template) => {
  printNextSteps(projectName, template, { installed: false })
}
