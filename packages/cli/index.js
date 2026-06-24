#!/usr/bin/env node

import { hideBin } from 'yargs/helpers'
import yargs from 'yargs/yargs'
import { createProject, showTemplateList } from './src/commands/create.js'
import { TEMPLATES } from './src/constants/templates.js'

let argv = yargs(hideBin(process.argv))
  .command('create', 'Create a new project', {
    template: {
      describe: 'Template name',
      demandOption: false, // optional so interactive mode can prompt
      type: 'string',
      choices: TEMPLATES.map((t) => t.name),
    },
    'project-id': {
      describe: 'Project ID',
      demandOption: false, // optional so interactive mode can prompt
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
    dev: {
      describe:
        'Start the dev server after install (non-interactive default: off; use --no-dev to skip)',
      type: 'boolean',
    },
    yes: {
      alias: 'y',
      describe:
        'Non-interactive: never prompt; fail fast on missing required options',
      type: 'boolean',
    },
    ci: {
      describe: 'Alias for --yes (run non-interactively)',
      type: 'boolean',
    },
    force: {
      alias: 'f',
      describe: 'Overwrite the target directory if it already exists',
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
