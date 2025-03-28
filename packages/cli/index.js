#!/usr/bin/env node

import chalk from 'chalk'
import spawn from 'cross-spawn'
import decompress from 'decompress'
import fs from 'fs-extra'
import fetch from 'node-fetch'
import ora from 'ora'
import { hideBin } from 'yargs/helpers'
import yargs from 'yargs/yargs'

const TEMPLATES = [
  {
    name: 'pilot',
    repoURL: 'https://github.com/Weaverse/pilot',
    defaultDownloadFolder: 'pilot-main',
    description: 'A modern and clean template for your Weaverse store',
  },
  {
    name: 'naturelle',
    repoURL: 'https://github.com/Weaverse/naturelle',
    defaultDownloadFolder: 'naturelle-main',
    description: 'A beautiful and elegant template for your Weaverse store',
  },
]

const getDownloadURL = (template, commitHash) => {
  if (commitHash) {
    return `${template.repoURL}/archive/${commitHash}.zip`
  }
  return `${template.repoURL}/archive/refs/heads/main.zip`
}

const getDownloadFolder = (template, commitHash) => {
  if (commitHash) {
    return `${template.name}-${commitHash}`
  }
  return template.defaultDownloadFolder
}

const downloadAndExtractTemplate = async (template, outputPath, commitHash) => {
  const downloadURL = getDownloadURL(template, commitHash)
  const downloadFolder = getDownloadFolder(template, commitHash)

  console.log(chalk.blue('\n🚀 Starting project creation...\n'))
  console.log(chalk.gray('Template details:'))
  console.log(chalk.gray(`- Name: ${template.name}`))
  console.log(chalk.gray(`- Description: ${template.description}`))
  console.log(chalk.gray(`- Source: ${downloadURL}\n`))

  const spinner = ora('Downloading template...').start()

  try {
    const response = await fetch(downloadURL)

    if (!response.ok) {
      spinner.fail('Failed to download template')
      throw new Error(
        `Failed to download template: ${response.statusText}. Make sure the commit hash is valid.`,
      )
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    spinner.text = 'Extracting template...'
    await decompress(buffer, `${outputPath}/temp`)

    spinner.text = 'Setting up project files...'
    // Move contents from temp to the root of outputPath and then remove temp
    const files = await fs.readdir(`${outputPath}/temp/${downloadFolder}`)
    for (let file of files) {
      await fs.move(
        `${outputPath}/temp/${downloadFolder}/${file}`,
        `${outputPath}/${file}`,
      )
    }
    await fs.remove(`${outputPath}/temp`)

    spinner.succeed('Template downloaded and extracted successfully')
  } catch (error) {
    spinner.fail('Failed to process template')
    throw error
  }
}

const createEnvFile = async (path, projectId) => {
  const spinner = ora('Setting up environment variables...').start()
  try {
    const envExamplePath = `${path}/.env.example`
    const envExampleContent = await fs.readFile(envExamplePath, 'utf-8')
    const envContent = `${envExampleContent}\nWEAVERSE_PROJECT_ID=${projectId}`
    await fs.writeFile(`${path}/.env`, envContent)
    spinner.succeed('Environment variables configured')
  } catch (error) {
    spinner.fail('Failed to set up environment variables')
    throw error
  }
}

function toKebabCase(str) {
  return str
    .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

const argv = yargs(hideBin(process.argv))
  .command('create', 'Create a new project', {
    template: {
      describe: 'Template name',
      demandOption: true,
      type: 'string',
      choices: TEMPLATES.map((t) => t.name),
    },
    'project-id': {
      describe: 'Project ID',
      demandOption: true,
      type: 'string',
    },
    'project-name': {
      describe: 'Project folder name',
      demandOption: false,
      default: 'my-weaverse-hydrogen-project',
      type: 'string',
    },
    commit: {
      describe:
        'Git commit hash to use (defaults to main branch if not specified)',
      demandOption: false,
      type: 'string',
    },
    'no-install': {
      describe: "Don't install dependencies and run dev",
      type: 'boolean',
    },
  })
  .option('help', {
    alias: 'h',
    type: 'boolean',
    description: 'Show help',
  }).argv

if (argv.help || !argv._.includes('create')) {
  console.log(chalk.blue('\nWeaverse CLI - Create a new project\n'))
  console.log(chalk.gray('Available templates:'))
  TEMPLATES.forEach((template) => {
    console.log(chalk.gray(`- ${template.name}: ${template.description}`))
  })
  console.log(`
Usage: npx @weaverse/cli create --template=<template-name> --project-id=<project-id> [--commit=<commit-hash>]

Options:
  --help        Show help
  --commit      Git commit hash to use (defaults to main branch if not specified)
  --no-install  Don't install dependencies and run dev
  `)
  process.exit(0)
}
;(async () => {
  try {
    if (argv.template) {
      let template = TEMPLATES.find((t) => t.name === argv.template)
      if (template) {
        const outputPath = `./${toKebabCase(argv['project-name'])}`
        const commitHash = argv.commit

        await downloadAndExtractTemplate(template, outputPath, commitHash)
        await createEnvFile(outputPath, argv['project-id'])

        if (!argv['no-install']) {
          const spinner = ora('Installing dependencies...').start()

          // remove the package-lock.json, it not necessary
          await fs
            .remove(`${outputPath}/package-lock.json`)
            .catch(console.error)

          // run 'npm install'
          const install = spawn('npm', ['install', '--legacy-peer-deps'], {
            cwd: outputPath,
            stdio: 'inherit',
          })

          install.on('close', (code) => {
            if (code !== 0) {
              spinner.fail('Failed to install dependencies')
              console.error(chalk.red(`npm install exited with code ${code}`))
              return
            }

            spinner.succeed('Dependencies installed successfully')
            console.log(chalk.green('\n🎉 Project created successfully!'))
            console.log(chalk.blue('\nNext steps:'))
            console.log(chalk.gray(`1. cd ${argv['project-name']}`))
            console.log(
              chalk.gray('2. Pull your Shopify environment variables:'),
            )
            console.log(chalk.gray('   npx shopify hydrogen env pull'))
            console.log(chalk.gray('3. npm run dev'))
            console.log(
              chalk.gray('4. Open http://localhost:3456 in your browser\n'),
            )

            // Then, run 'npm run dev' after 'npm install' completes
            const runDev = spawn('npm', ['run', 'dev'], {
              cwd: outputPath,
              stdio: 'inherit',
            })

            runDev.on('close', (code) => {
              if (code !== 0) {
                console.error(chalk.red(`npm run dev exited with code ${code}`))
              }
            })
          })
        } else {
          console.log(chalk.green('\n🎉 Project created successfully!'))
          console.log(chalk.blue('\nNext steps:'))
          console.log(chalk.gray(`1. cd ${argv['project-name']}`))
          console.log(chalk.gray('2. Pull your Shopify environment variables:'))
          console.log(chalk.gray('   npx shopify hydrogen env pull'))
          console.log(chalk.gray('3. npm install'))
          console.log(chalk.gray('4. npm run dev'))
          console.log(
            chalk.gray('5. Open http://localhost:3456 in your browser\n'),
          )
        }
      }
    }
  } catch (error) {
    console.error(chalk.red('\n❌ Error:'), error.message)
    process.exit(1)
  }
})()
