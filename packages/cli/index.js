#!/usr/bin/env node

const decompress = require('decompress')
const fs = require('fs-extra')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const spawn = require('cross-spawn')

const TEMPLATES = [
  {
    name: 'pilot',
    downloadURL:
      'https://github.com/Weaverse/pilot/archive/refs/heads/main.zip',
    defaultDownloadFolder: 'pilot-main',
  },
  {
    name: 'naturelle',
    downloadURL:
      'https://github.com/Weaverse/naturelle/archive/refs/heads/main.zip',
    defaultDownloadFolder: 'naturelle-main',
  },
]

const downloadAndExtractTemplate = async (template, outputPath) => {
  const fetch = (await import('node-fetch')).default
  let { downloadURL, defaultDownloadFolder } = template
  const response = await fetch(downloadURL)
  const buffer = await response.buffer()
  await decompress(buffer, `${outputPath}/temp`)

  // Move contents from temp to the root of outputPath and then remove temp
  const files = await fs.readdir(`${outputPath}/temp/${defaultDownloadFolder}`)
  for (let file of files) {
    await fs.move(
      `${outputPath}/temp/${defaultDownloadFolder}/${file}`,
      `${outputPath}/${file}`,
    )
  }
  await fs.remove(`${outputPath}/temp`)
}

const createEnvFile = async (path, projectId) => {
  const envExamplePath = `${path}/.env.example`
  const envExampleContent = await fs.readFile(envExamplePath, 'utf-8')
  const envContent = `${envExampleContent}\nWEAVERSE_PROJECT_ID=${projectId}`
  await fs.writeFile(`${path}/.env`, envContent)
}

function toKebabCase(str) {
  return str
    .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2') // Convert camelCase to kebab-case
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with dashes
    .toLowerCase() // Convert to lowercase
}

const argv = yargs(hideBin(process.argv))
  .command('create', 'Create a new project', {
    template: {
      describe: 'Template name',
      demandOption: true,
      type: 'string',
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
  console.log(`
Usage: npx @weaverse/cli create --template=<template-name> --project-id=<project-id>

Options:
  --help        Show help
  --no-install  Don't install dependencies and run dev
  `)
  process.exit(0)
}
;(async () => {
  if (argv.template) {
    let template = TEMPLATES.find((t) => t.name === argv.template)
    if (template) {
      const outputPath = `./${toKebabCase(argv['project-name'])}`

      await downloadAndExtractTemplate(template, outputPath)
      await createEnvFile(outputPath, argv['project-id'])

      if (!argv['no-install']) {
        // remove the package-lock.json, it not necessary
        await fs.remove(`${outputPath}/package-lock.json`).catch(console.error)

        // run 'npm install'
        const install = spawn('npm', ['install', '--ignore-scripts'], {
          cwd: outputPath,
          stdio: 'inherit',
        })

        install.on('data', (data) => {
          console.log(data.toString())
        })
        install.on('close', (code) => {
          if (code !== 0) {
            console.error(`npm install exited with code ${code}`)
            return
          }

          // Then, run 'npm run dev' after 'npm install' completes
          const runDev = spawn('npm', ['run', 'dev'], {
            cwd: outputPath,
            stdio: 'inherit',
          })

          runDev.on('close', (code) => {
            if (code !== 0) {
              console.error(`npm run dev exited with code ${code}`)
            }
          })
        })
      }
    }
  }
})()
