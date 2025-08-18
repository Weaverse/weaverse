import chalk from 'chalk'
import decompress from 'decompress'
import fs from 'fs-extra'
import fetch from 'node-fetch'
import ora from 'ora'
import { getDownloadFolder, getDownloadURL } from '../constants/templates.js'

export let downloadAndExtractTemplate = async (
  template,
  outputPath,
  commitHash
) => {
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

    spinner.succeed('Template downloaded and extracted successfully')
    return true
  } catch (error) {
    spinner.fail('Failed to process template')
    throw error
  }
}
