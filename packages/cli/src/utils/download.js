import chalk from 'chalk'
import decompress from 'decompress'
import fs from 'fs-extra'
import fetch from 'node-fetch'
import ora from 'ora'
import { getDownloadFolder, getDownloadURL } from '../constants/templates.js'

/**
 * Template folders that only serve the Weaverse team: .weaverse holds internal
 * specs and docs, .github holds workflows (Oxygen deploy, CI, code review)
 * that depend on Weaverse secrets and would fail in a new project.
 */
const TEMPLATE_INTERNAL_FOLDERS = ['.weaverse', '.github']

/**
 * Removes Weaverse-internal folders from the output path if they exist
 * @param {string} outputPath - The project output directory
 * @returns {Promise<boolean>} True if all folders were removed or didn't exist, false on error
 */
export async function removeTemplateInternalFolders(outputPath) {
  let ok = true
  for (let folder of TEMPLATE_INTERNAL_FOLDERS) {
    try {
      await fs.remove(`${outputPath}/${folder}`)
    } catch (error) {
      console.warn(
        chalk.yellow(
          `Warning: Could not remove ${folder} folder: ${error.message}`
        )
      )
      ok = false
    }
  }
  return ok
}

/**
 * Downloads and extracts a template from GitHub repository
 * @param {Object} template - Template configuration object
 * @param {string} outputPath - Destination directory for extracted files
 * @param {string} [commitHash] - Specific commit hash to download (optional)
 * @returns {Promise<void>} Promise that resolves when download and extraction complete
 * @throws {Error} If download or extraction fails
 */
export async function downloadAndExtractTemplate(
  template,
  outputPath,
  commitHash
) {
  let downloadURL = getDownloadURL(template, commitHash)
  let downloadFolder = getDownloadFolder(template, commitHash)

  console.log(chalk.blue('\n🚀 Starting project creation...\n'))
  console.log(chalk.gray('Template details:'))
  console.log(chalk.gray(`- Name: ${template.name}`))
  console.log(chalk.gray(`- Description: ${template.description}`))
  console.log(chalk.gray(`- Source: ${downloadURL}\n`))

  let spinner = ora('Downloading template...').start()

  try {
    let response = await fetch(downloadURL)

    if (!response.ok) {
      spinner.fail('Failed to download template')
      throw new Error(
        `Failed to download template: ${response.statusText}. Make sure the commit hash is valid.`
      )
    }

    let arrayBuffer = await response.arrayBuffer()
    let buffer = Buffer.from(arrayBuffer)

    spinner.text = 'Extracting template...'
    await decompress(buffer, `${outputPath}/temp`)

    spinner.text = 'Setting up project files...'
    // Move contents from temp to the root of outputPath and then remove temp
    let files = await fs.readdir(`${outputPath}/temp/${downloadFolder}`)
    for (let file of files) {
      await fs.move(
        `${outputPath}/temp/${downloadFolder}/${file}`,
        `${outputPath}/${file}`
      )
    }
    await fs.remove(`${outputPath}/temp`)

    await removeTemplateInternalFolders(outputPath)

    spinner.succeed('Template downloaded and extracted successfully')
    return true
  } catch (error) {
    spinner.fail('Failed to process template')
    throw error
  }
}
