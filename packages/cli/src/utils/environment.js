import fs from 'fs-extra'
import ora from 'ora'

/**
 * Creates .env file from .env.example template with project-specific values
 * @param {string} path - The project directory path
 * @param {string} projectId - The project ID to inject into environment variables
 * @returns {Promise<void>} Promise that resolves when .env file is created
 * @throws {Error} If file operations fail
 */
export let createEnvFile = async (path, projectId) => {
  let spinner = ora('Setting up environment variables...').start()
  try {
    let envExamplePath = `${path}/.env.example`
    let envExampleContent = await fs.readFile(envExamplePath, 'utf-8')

    // Replace existing WEAVERSE_PROJECT_ID or add it if it doesn't exist
    let envContent
    if (envExampleContent.includes('WEAVERSE_PROJECT_ID=')) {
      envContent = envExampleContent.replace(
        // biome-ignore lint/performance/useTopLevelRegex: the func only run once
        /WEAVERSE_PROJECT_ID=.*/,
        `WEAVERSE_PROJECT_ID=${projectId}`
      )
    } else {
      envContent = `${envExampleContent}\nWEAVERSE_PROJECT_ID=${projectId}`
    }

    await fs.writeFile(`${path}/.env`, envContent)
    spinner.succeed('Environment variables configured')
    return true
  } catch (error) {
    spinner.fail('Failed to set up environment variables')
    throw error
  }
}

/**
 * Converts a string to kebab-case format (lowercase with hyphens)
 * @param {string} str - The string to convert
 * @returns {string} The kebab-case formatted string
 */
export let toKebabCase = (str) =>
  str
    .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
