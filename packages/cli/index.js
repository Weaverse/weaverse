#!/usr/bin/env node

import { createRequire } from 'node:module'
import { hideBin } from 'yargs/helpers'
import yargs from 'yargs/yargs'
import { createProject, showTemplateList } from './src/commands/create.js'
import { migrateV6 } from './src/commands/migrate.js'
import { TEMPLATES } from './src/constants/templates.js'

// yargs' automatic version lookup can't find package.json from this ESM entry
// and prints "unknown", so read the version explicitly.
const { version: CLI_VERSION } = createRequire(import.meta.url)(
  './package.json'
)

let argv = yargs(hideBin(process.argv))
  .version(CLI_VERSION)
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
  .command(
    'migrate <target>',
    'Rewrite a theme for a new major SDK version (v6: @weaverse/hydrogen 6)',
    (y) =>
      y
        .positional('target', { type: 'string', choices: ['v6'] })
        .option('dir', {
          describe: 'Project directory (defaults to the current directory)',
          type: 'string',
        })
        .option('dry-run', {
          describe: 'List the files that would change without writing them',
          type: 'boolean',
        })
  )
  .option('help', {
    alias: 'h',
    type: 'boolean',
    description: 'Show help',
  })
  .help().argv

if (argv._.includes('migrate')) {
  await migrateV6({ dir: argv.dir, dryRun: argv.dryRun })
  process.exit(0)
}

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
