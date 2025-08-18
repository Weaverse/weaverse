import chalk from 'chalk'
import spawn from 'cross-spawn'
import fs from 'fs-extra'
import ora from 'ora'

/**
 * Installs dependencies for a newly created project and displays next steps
 * @param {string} outputPath - The project directory path
 * @param {string} projectName - The project name for display purposes
 * @returns {Promise<boolean>} True if installation succeeds
 * @throws {Error} If npm install fails
 */
export let installDependenciesAndRun = async (outputPath, projectName) => {
  let spinner = ora('Installing dependencies...').start()

  try {
    // remove the package-lock.json, it not necessary
    await fs.remove(`${outputPath}/package-lock.json`).catch(console.error)

    // run 'npm install'
    let installPromise = new Promise((resolve, reject) => {
      let install = spawn('npm', ['install', '--legacy-peer-deps'], {
        cwd: outputPath,
        stdio: 'pipe', // Change to 'pipe' to capture output
      })

      install.on('close', (installCode) => {
        if (installCode !== 0) {
          reject(new Error(`npm install exited with code ${installCode}`))
        } else {
          resolve()
        }
      })

      install.on('error', (error) => {
        reject(error)
      })
    })

    await installPromise
    spinner.succeed('Dependencies installed successfully')

    console.log(chalk.green('\n🎉 Project created successfully!'))
    console.log(chalk.blue('\nNext steps:'))
    console.log(chalk.gray(`1. cd ${projectName}`))
    console.log(chalk.gray('2. Pull your Shopify environment variables:'))
    console.log(chalk.gray('   npx shopify hydrogen env pull'))
    console.log(chalk.gray('3. npm run dev'))
    console.log(chalk.gray('4. Open http://localhost:3456 in your browser\n'))

    return true
  } catch (error) {
    spinner.fail('Failed to install dependencies')
    throw error
  }
}

/**
 * Starts the development server for a newly created project
 * @param {string} outputPath - The project directory path
 * @returns {void} Starts the dev server process
 */
export let runDevServer = (outputPath) => {
  console.log(chalk.blue('Starting development server...\n'))

  // Run 'npm run dev' after 'npm install' completes
  let runDev = spawn('npm', ['run', 'dev'], {
    cwd: outputPath,
    stdio: 'inherit',
  })

  runDev.on('close', (runDevCode) => {
    if (runDevCode !== 0) {
      console.error(chalk.red(`npm run dev exited with code ${runDevCode}`))
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
 * @returns {void} Prints setup instructions to console
 */
export let showManualInstructions = (projectName) => {
  console.log(chalk.green('\n🎉 Project created successfully!'))
  console.log(chalk.blue('\nNext steps:'))
  console.log(chalk.gray(`1. cd ${projectName}`))
  console.log(chalk.gray('2. Pull your Shopify environment variables:'))
  console.log(chalk.gray('   npx shopify hydrogen env pull'))
  console.log(chalk.gray('3. npm install'))
  console.log(chalk.gray('4. npm run dev'))
  console.log(chalk.gray('5. Open http://localhost:3456 in your browser\n'))
}
