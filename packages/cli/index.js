#!/usr/bin/env node

import { hideBin } from 'yargs/helpers'
import yargs from 'yargs/yargs'
import { createProject, showTemplateList } from './src/commands/create.js'
import { TEMPLATES } from './src/constants/templates.js'

let argv = yargs(hideBin(process.argv))
  .command('create', 'Create a new project', {
    template: {
      describe: 'Template name',
      demandOption: false, // Changed to false to allow interactive prompts
      type: 'string',
      choices: TEMPLATES.map((t) => t.name),
    },
    'project-id': {
      describe: 'Project ID',
      demandOption: false, // Changed to false to allow interactive prompts
      type: 'string',
    },
    'project-name': {
      describe: 'Project folder name',
      demandOption: false,
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
  })
  .help().argv

// Handle help or no command
if (argv.help || !argv._.includes('create')) {
  showTemplateList()
  process.exit(0)
}
// Execute create command
;(async () => {
  if (argv._.includes('create')) {
    await createProject(argv)
  }
})()
