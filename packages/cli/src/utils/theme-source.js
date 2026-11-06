import { createHash } from 'node:crypto'
import path from 'node:path'
import decompress from 'decompress'
import fs from 'fs-extra'
import nodeFetch from 'node-fetch'
import yauzl from 'yauzl'

/** Builder origin that serves `/api/public/theme-source`. */
export const DEFAULT_API_BASE = 'https://studio.weaverse.io'

const GET_NEW_COMMAND =
  'Get a new install command from your Weaverse dashboard.'

/**
 * What to tell the user for each `error` code the theme-source endpoint
 * returns for a one-time pass. Every message ends with the next step to take.
 */
export const THEME_SOURCE_ERRORS = {
  invalid_pass: `This install pass is not valid. Check that you copied the whole command. ${GET_NEW_COMMAND}`,
  expired_pass: `This install pass has expired (passes last 10 minutes). ${GET_NEW_COMMAND}`,
  used_pass: `This install pass has already been used. ${GET_NEW_COMMAND}`,
  no_license:
    'This store has no active license for this theme. Check the theme in your Weaverse dashboard.',
  rate_limited:
    'Too many install attempts. Wait a minute, then try again with a new install command.',
  not_found: `The theme source could not be found. ${GET_NEW_COMMAND}`,
}

/**
 * The same, for a free partner theme asked for by handle
 * (`--template=<handle>`), where there is no pass to renew.
 * @param {string} handle
 * @param {string[]} templateNames - Weaverse template names, for the hint
 * @returns {Record<string, string>}
 */
export let themeHandleErrors = (handle, templateNames) => ({
  not_found: `No Weaverse template or free partner theme is named "${handle}". Weaverse templates: ${templateNames.join(', ')}. Browse partner themes at https://weaverse.io/themes`,
  not_free: `"${handle}" is a paid partner theme. Buy it at https://weaverse.io/themes/${handle}, then create a project from it in your Weaverse dashboard to get its install command.`,
  rate_limited: 'Too many install attempts. Wait a minute, then try again.',
})

const SHA256_HEX = /^[0-9a-f]{64}$/i
const WINDOWS_DRIVE = /^[a-z]:/i
const TRAILING_SLASHES = /\/+$/
const DEV_PORT_FLAG = /--port[=\s]+(\d+)/
const PERMISSION_BITS = 0o777
const DEFAULT_FILE_MODE = 0o644
/** Port `shopify hydrogen dev` uses when its `--port` flag isn't set. */
const HYDROGEN_DEV_PORT = 3000
/** Bytes in a mebibyte. */
const MB = 1_048_576
const MAX_UNPACKED_MB = 500
const MAX_ENTRIES = 20_000

/**
 * Caps on what a theme source zip may unpack to, checked from the central
 * directory before anything is inflated (zip-bomb guard).
 */
export const ZIP_LIMITS = {
  maxBytes: MAX_UNPACKED_MB * MB,
  maxEntries: MAX_ENTRIES,
}

/** A zip over {@link ZIP_LIMITS}; its message reads after "too large: ". */
class LimitError extends Error {}

/**
 * The Builder origin to call: `--api-base`, then `WEAVERSE_BUILDER_URL`, then
 * {@link DEFAULT_API_BASE}. Trailing slashes are dropped.
 * @param {Object} argv - Command line arguments
 * @param {NodeJS.ProcessEnv} [env]
 * @returns {string}
 */
export let resolveApiBase = (argv = {}, env = process.env) =>
  (argv['api-base'] || env.WEAVERSE_BUILDER_URL || DEFAULT_API_BASE).replace(
    TRAILING_SLASHES,
    ''
  )

/**
 * Exchanges a credential for a short-lived download of a partner theme's
 * source: a one-time install pass (spent by this call, whatever happens
 * afterwards), or the handle of a free partner theme.
 * @param {Object} options
 * @param {string} options.apiBase - Builder origin
 * @param {{ pass: string } | { handle: string }} options.credential
 * @param {Record<string, string>} [options.errors] - Message per error code
 * @param {typeof nodeFetch} [options.fetch]
 * @returns {Promise<{ url: string, handle: string, fileName: string, sha256: string, revisionId: string }>}
 * @throws {Error} With a user-facing message for every failure
 */
export let requestThemeSource = async ({
  apiBase,
  credential,
  errors = THEME_SOURCE_ERRORS,
  fetch = nodeFetch,
}) => {
  let response
  try {
    response = await fetch(`${apiBase}/api/public/theme-source`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify(credential),
    })
  } catch (error) {
    throw new Error(`Could not reach Weaverse at ${apiBase}: ${error.message}`)
  }

  let body = null
  try {
    body = await response.json()
  } catch {
    // Not JSON: handled below as an unexpected response.
  }

  if (!response.ok) {
    let message = errors[body?.error]
    if (message) {
      throw new Error(message)
    }
    throw new Error(
      'pass' in credential
        ? `Weaverse could not provide the theme source (HTTP ${response.status}). ${GET_NEW_COMMAND}`
        : `Weaverse could not provide the theme source (HTTP ${response.status}). Try again later.`
    )
  }

  let valid =
    typeof body?.url === 'string' &&
    typeof body.handle === 'string' &&
    body.handle.length > 0 &&
    typeof body.fileName === 'string' &&
    typeof body.revisionId === 'string' &&
    typeof body.sha256 === 'string' &&
    SHA256_HEX.test(body.sha256)
  if (!valid) {
    throw new Error(
      'Weaverse returned an unexpected response for the theme source. Update the CLI (npx @weaverse/cli@latest) and try again.'
    )
  }
  return body
}

/**
 * Downloads the theme source zip and checks it against the expected SHA-256
 * before anything is written to disk.
 * @param {Object} options
 * @param {string} options.url - Presigned download URL
 * @param {string} options.sha256 - Expected hex SHA-256 of the zip bytes
 * @param {typeof nodeFetch} [options.fetch]
 * @returns {Promise<Buffer>} The verified zip bytes
 * @throws {Error} When the download fails or the checksum doesn't match
 */
export let downloadThemeSource = async ({ url, sha256, fetch = nodeFetch }) => {
  let response
  try {
    response = await fetch(url)
  } catch (error) {
    throw new Error(
      `Could not download the theme source: ${error.message}. ${GET_NEW_COMMAND}`
    )
  }
  if (!response.ok) {
    throw new Error(
      `Could not download the theme source (HTTP ${response.status}). The download link lasts 2 minutes. ${GET_NEW_COMMAND}`
    )
  }

  let buffer = Buffer.from(await response.arrayBuffer())
  let actual = createHash('sha256').update(buffer).digest('hex')
  if (actual !== sha256.toLowerCase()) {
    throw new Error(
      `The downloaded theme source failed its integrity check (expected SHA-256 ${sha256.toLowerCase()}, got ${actual}). Nothing was extracted. ${GET_NEW_COMMAND}`
    )
  }
  return buffer
}

/**
 * Rejects zip entry names that could land outside the project folder:
 * absolute paths, drive letters, backslashes and `..` segments.
 * @param {string} name - Entry name as stored in the zip
 * @returns {boolean}
 */
let isUnsafeEntryPath = (name) =>
  name.length === 0 ||
  name.startsWith('/') ||
  name.includes('\\') ||
  name.includes('\0') ||
  WINDOWS_DRIVE.test(name) ||
  name.split('/').includes('..')

/**
 * Keeps only a zip entry's permission bits (e.g. executable scripts), never
 * setuid/setgid/sticky; entries without bits get a regular file mode.
 * @param {number} [mode]
 * @returns {number}
 */
let permissionBits = (mode = DEFAULT_FILE_MODE) => {
  // biome-ignore lint/suspicious/noBitwiseOperators: masking file mode bits
  let bits = mode & PERMISSION_BITS
  return bits || DEFAULT_FILE_MODE
}

/**
 * Turns decompressed zip entries into the files to write, relative to the
 * project folder. Partner zips hold the project either at the root (a root
 * `package.json`) or inside one top-level folder; the folder is stripped so
 * the project lands directly in the target directory. Loose root-level files
 * next to that folder are not part of the project and are left out, as are
 * macOS `__MACOSX/` entries.
 * @param {Array<{ path: string, type: string, data?: Buffer, mode?: number }>} entries
 * @returns {Array<{ path: string, data: Buffer, mode: number }>}
 * @throws {Error} On links, unsafe paths or an empty archive
 */
export let planThemeSourceFiles = (entries) => {
  let relevant = entries.filter(
    (entry) => entry.path !== '__MACOSX' && !entry.path.startsWith('__MACOSX/')
  )

  for (let entry of relevant) {
    if (entry.type !== 'file' && entry.type !== 'directory') {
      throw new Error(
        `The theme source contains a link (${entry.path}), which is not allowed. Nothing was extracted. Contact the theme's partner.`
      )
    }
    if (isUnsafeEntryPath(entry.path)) {
      throw new Error(
        `The theme source contains an unsafe path (${entry.path}). Nothing was extracted. Contact the theme's partner.`
      )
    }
  }

  // Folder entries written without mode bits (external attributes 0, e.g. by
  // Java's ZipOutputStream) arrive as `file`; the trailing `/` marks them.
  let files = relevant.filter(
    (entry) => entry.type === 'file' && !entry.path.endsWith('/')
  )
  if (files.length === 0) {
    throw new Error(
      "The theme source is empty or is not a valid zip. Contact the theme's partner."
    )
  }

  let topDirs = new Set(
    files
      .filter((file) => file.path.includes('/'))
      .map((file) => file.path.split('/')[0])
  )
  let hasRootPackageJson = files.some((file) => file.path === 'package.json')
  let prefix =
    !hasRootPackageJson && topDirs.size === 1 ? `${[...topDirs][0]}/` : ''

  return files
    .filter((file) => file.path.startsWith(prefix))
    .map((file) => ({
      path: file.path.slice(prefix.length),
      data: file.data,
      mode: permissionBits(file.mode),
    }))
    .filter((file) => file.path.length > 0)
}

/**
 * Reads the zip's central directory and rejects archives that would unpack
 * past the limits, before any entry is inflated into memory. Declared sizes
 * are enforced while inflating by yauzl's `validateEntrySizes`.
 * @param {Buffer} buffer - Zip bytes
 * @param {{ maxBytes: number, maxEntries: number }} limits
 * @returns {Promise<void>}
 * @throws {Error} When the archive is unreadable or over a limit
 */
let checkZipLimits = (buffer, { maxBytes, maxEntries }) =>
  new Promise((resolve, reject) => {
    yauzl.fromBuffer(
      buffer,
      { lazyEntries: true, validateEntrySizes: true },
      (openError, zip) => {
        if (openError) {
          reject(openError)
          return
        }
        let fail = (error) => {
          zip.close()
          reject(error)
        }
        if (zip.entryCount > maxEntries) {
          fail(
            new LimitError(
              `it has ${zip.entryCount} entries, more than the ${maxEntries} allowed`
            )
          )
          return
        }
        let totalBytes = 0
        zip.on('entry', (entry) => {
          totalBytes += entry.uncompressedSize
          if (totalBytes > maxBytes) {
            fail(
              new LimitError(
                `it unpacks to more than ${maxBytes >= MB ? `${maxBytes / MB} MB` : `${maxBytes} bytes`}`
              )
            )
            return
          }
          zip.readEntry()
        })
        zip.on('end', resolve)
        zip.on('error', reject)
        zip.readEntry()
      }
    )
  })

/**
 * Extracts a verified theme source zip into `outputPath`, writing only regular
 * files that resolve inside it. The directory must be empty or absent; if
 * extraction fails, everything written is removed again.
 * @param {Buffer} buffer - Verified zip bytes
 * @param {string} outputPath - Project directory
 * @param {Object} [options]
 * @param {{ maxBytes: number, maxEntries: number }} [options.limits] -
 *   Unpacked size and entry count caps (default {@link ZIP_LIMITS})
 * @returns {Promise<number>} The number of files written
 */
export let extractThemeSource = async (
  buffer,
  outputPath,
  { limits = ZIP_LIMITS } = {}
) => {
  let entries
  try {
    await checkZipLimits(buffer, limits)
    entries = await decompress(buffer)
  } catch (error) {
    if (error instanceof LimitError) {
      throw new Error(
        `The theme source is too large: ${error.message}. Nothing was extracted. Contact the theme's partner.`
      )
    }
    throw new Error(
      `The theme source could not be unpacked: ${error.message}. Nothing was extracted. Contact the theme's partner.`
    )
  }
  let files = planThemeSourceFiles(entries)

  let root = path.resolve(outputPath)
  let existed = await fs.pathExists(root)
  try {
    for (let file of files) {
      let target = path.resolve(root, file.path)
      if (!target.startsWith(`${root}${path.sep}`)) {
        throw new Error(
          `The theme source contains an unsafe path (${file.path}). Nothing was extracted. Contact the theme's partner.`
        )
      }
      await fs.outputFile(target, file.data, { mode: file.mode })
    }
  } catch (error) {
    if (existed) {
      await fs.emptyDir(root)
    } else {
      await fs.remove(root)
    }
    throw error
  }
  return files.length
}

/**
 * Reads how an extracted theme installs and runs: Bun when it ships a Bun
 * lockfile (npm otherwise), and the port its `dev` script passes with
 * `--port` (the Hydrogen CLI default, 3000, otherwise).
 * @param {string} outputPath - Project directory
 * @returns {Promise<{ packageManager: 'npm' | 'bun', devPort: number }>}
 */
export let detectThemeSetup = async (outputPath) => {
  let usesBun =
    (await fs.pathExists(path.join(outputPath, 'bun.lock'))) ||
    (await fs.pathExists(path.join(outputPath, 'bun.lockb')))

  let devPort = HYDROGEN_DEV_PORT
  try {
    let pkg = await fs.readJson(path.join(outputPath, 'package.json'))
    let match = DEV_PORT_FLAG.exec(pkg?.scripts?.dev ?? '')
    if (match) {
      devPort = Number(match[1])
    }
  } catch {
    // No readable package.json: keep the default port.
  }

  return { packageManager: usesBun ? 'bun' : 'npm', devPort }
}
