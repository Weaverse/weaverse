import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import chalk from 'chalk'

const SOURCE_FILE_RE = /\.(?:[cm]?[jt]sx?)$/
const SKIPPED_DIRS = new Set([
  'node_modules',
  'dist',
  'build',
  '.git',
  '.react-router',
  '.next',
  '.cache',
])

// Module specifiers that moved in @weaverse/hydrogen 6.0.
const SPECIFIER_MOVES = [
  ['@weaverse/hydrogen', '@weaverse/hydrogen/react-router'],
  ['@weaverse/next/server', '@weaverse/hydrogen/next/server'],
  ['@weaverse/next', '@weaverse/hydrogen/next'],
]

// Public types renamed in @weaverse/hydrogen 6.0.
const RENAMES = [
  ['HydrogenComponentSchema', 'WeaverseComponentSchema'],
  ['HydrogenComponentProps', 'WeaverseComponentProps'],
  ['HydrogenThemeSchema', 'WeaverseThemeSchema'],
  ['HydrogenComponent', 'WeaverseComponent'],
  ['ThemeSettingsResponse', 'WeaverseThemeSettingsResponse'],
  ['ComponentLoaderArgs', 'WeaverseComponentLoaderArgs'],
  ['HydrogenComponentData', 'WeaverseComponentData'],
  ['HydrogenPageData', 'WeaversePageData'],
  ['HydrogenProjectType', 'WeaverseProjectType'],
  ['HydrogenPageAssignment', 'WeaversePageAssignment'],
  ['HydrogenThemeSettings', 'WeaverseThemeSettings'],
  ['HydrogenChildComponentReference', 'WeaverseChildComponentReference'],
]

const WEAVERSE_IMPORT_RE = /(['"])@weaverse\/(?:hydrogen|next)(?:\/[\w-]+)*\1/

/**
 * Rewrites one source file for @weaverse/hydrogen 6.0: moves imports to the
 * framework entries and renames the public `Hydrogen*` types. Renames apply
 * only to files that import Weaverse, so a theme's own types stay untouched.
 * @param {string} source
 * @returns {string}
 */
export function migrateV6Source(source) {
  if (!WEAVERSE_IMPORT_RE.test(source)) {
    return source
  }
  let result = source
  for (let [from, to] of SPECIFIER_MOVES) {
    let escaped = from.replaceAll('/', '\\/')
    result = result.replace(
      new RegExp(`(['"])${escaped}\\1`, 'g'),
      (_match, quote) => `${quote}${to}${quote}`
    )
  }
  for (let [from, to] of RENAMES) {
    result = result.replace(new RegExp(`\\b${from}\\b`, 'g'), to)
  }
  return result
}

async function* walk(dir) {
  for (let entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIPPED_DIRS.has(entry.name)) {
        yield* walk(join(dir, entry.name))
      }
    } else if (SOURCE_FILE_RE.test(entry.name)) {
      yield join(dir, entry.name)
    }
  }
}

/**
 * `weaverse migrate v6`: rewrites every source file under `dir` in place.
 * @param {{ dir?: string, dryRun?: boolean }} options
 */
export async function migrateV6({ dir = process.cwd(), dryRun = false } = {}) {
  let changed = []
  for await (let file of walk(dir)) {
    let source = await readFile(file, 'utf8')
    let migrated = migrateV6Source(source)
    if (migrated !== source) {
      changed.push(relative(dir, file))
      if (!dryRun) {
        await writeFile(file, migrated)
      }
    }
  }

  let verb = dryRun ? 'Would update' : 'Updated'
  console.log(chalk.green(`${verb} ${changed.length} file(s)`))
  for (let file of changed) {
    console.log(`  ${file}`)
  }
  console.log(
    chalk.cyan(
      '\nNext: upgrade @shopify/hydrogen to 2026.10+ and @weaverse/hydrogen to 6, then run your typecheck.'
    )
  )
  return changed
}
