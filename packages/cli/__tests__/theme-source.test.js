// biome-ignore-all lint/style/noMagicNumbers: HTTP statuses, hash lengths and ports in fixtures
import { createHash } from 'node:crypto'
import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import fs from 'fs-extra'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createProjectFromPass } from '../src/commands/create-from-pass.js'
import {
  DEFAULT_API_BASE,
  detectThemeSetup,
  downloadThemeSource,
  extractThemeSource,
  planThemeSourceFiles,
  requestThemeSource,
  resolveApiBase,
  THEME_SOURCE_ERRORS,
  ZIP_LIMITS,
} from '../src/utils/theme-source.js'
import { buildZip } from './helpers/zip.js'

const API_BASE = 'https://builder.test'
const INTEGRITY_ERROR = /integrity check/
const LINK_ERROR = /contains a link/
const UNSAFE_PATH_ERROR = /unsafe path/
const UNPACK_ERROR = /could not be unpacked/
const UNEXPECTED_RESPONSE_ERROR = /unexpected response/
const UNREACHABLE_ERROR = /Could not reach Weaverse at https:\/\/builder\.test/
const HTTP_500_ERROR = /HTTP 500/
const COMBINED_FLAGS_ERROR = /cannot be combined with --template/
const FORCE_HINT_ERROR = /--force/
const TOO_MANY_ENTRIES_ERROR = /too large: it has 3 entries, more than the 2/
const TOO_LARGE_ERROR = /too large: it unpacks to more than/

let sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex')

let jsonResponse = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

let sourceBody = (overrides = {}) => ({
  url: 'https://r2.test/source.zip?signature=abc',
  handle: 'aurora',
  fileName: 'aurora-1.0.0.zip',
  sha256: 'a'.repeat(64),
  revisionId: 'rev_123',
  ...overrides,
})

let fileEntry = (entryPath, data = '') => ({
  path: entryPath,
  type: 'file',
  data: Buffer.from(data),
  mode: 0o644,
})

describe('resolveApiBase', () => {
  it('should_prefer_the_flag_over_the_env_when_both_are_set', () => {
    // Arrange
    let argv = { 'api-base': 'http://localhost:3000/' }
    let env = { WEAVERSE_BUILDER_URL: 'https://staging.test' }

    // Act
    let result = resolveApiBase(argv, env)

    // Assert
    expect(result).toBe('http://localhost:3000')
  })

  it('should_use_the_env_when_no_flag_is_set', () => {
    // Act
    let result = resolveApiBase({}, { WEAVERSE_BUILDER_URL: 'https://s.test' })

    // Assert
    expect(result).toBe('https://s.test')
  })

  it('should_use_studio_when_nothing_is_set', () => {
    // Act
    let result = resolveApiBase({}, {})

    // Assert
    expect(result).toBe(DEFAULT_API_BASE)
  })
})

describe('requestThemeSource', () => {
  it('should_post_the_pass_as_json_to_the_theme_source_endpoint', async () => {
    // Arrange
    let fetch = vi.fn(async () => jsonResponse(200, sourceBody()))

    // Act
    await requestThemeSource({ apiBase: API_BASE, pass: 'p4ss', fetch })

    // Assert
    expect(fetch).toHaveBeenCalledWith(
      'https://builder.test/api/public/theme-source',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ pass: 'p4ss' }),
      })
    )
  })

  it('should_return_the_source_when_the_response_is_valid', async () => {
    // Arrange
    let fetch = vi.fn(async () => jsonResponse(200, sourceBody()))

    // Act
    let result = await requestThemeSource({
      apiBase: API_BASE,
      pass: 'p',
      fetch,
    })

    // Assert
    expect(result).toEqual(sourceBody())
  })

  it.each([
    [400, 'invalid_pass'],
    [401, 'invalid_pass'],
    [410, 'expired_pass'],
    [410, 'used_pass'],
    [403, 'no_license'],
    [429, 'rate_limited'],
    [404, 'not_found'],
  ])('should_explain_%i_%s_when_the_endpoint_rejects_the_pass', async (status, code) => {
    // Arrange
    let fetch = vi.fn(async () => jsonResponse(status, { error: code }))

    // Act
    let request = requestThemeSource({ apiBase: API_BASE, pass: 'p', fetch })

    // Assert
    await expect(request).rejects.toThrow(THEME_SOURCE_ERRORS[code])
  })

  it('should_point_to_the_dashboard_when_a_pass_is_used_or_expired', () => {
    // Act
    let messages = [
      THEME_SOURCE_ERRORS.used_pass,
      THEME_SOURCE_ERRORS.expired_pass,
    ]

    // Assert
    for (let message of messages) {
      expect(message).toContain(
        'Get a new install command from your Weaverse dashboard'
      )
    }
  })

  it('should_report_the_status_when_the_error_body_is_not_json', async () => {
    // Arrange
    let fetch = vi.fn(async () => new Response('oops', { status: 500 }))

    // Act
    let request = requestThemeSource({ apiBase: API_BASE, pass: 'p', fetch })

    // Assert
    await expect(request).rejects.toThrow(HTTP_500_ERROR)
  })

  it('should_reject_when_the_success_body_has_no_valid_sha256', async () => {
    // Arrange
    let body = sourceBody({ sha256: 'not-a-hash' })
    let fetch = vi.fn(async () => jsonResponse(200, body))

    // Act
    let request = requestThemeSource({ apiBase: API_BASE, pass: 'p', fetch })

    // Assert
    await expect(request).rejects.toThrow(UNEXPECTED_RESPONSE_ERROR)
  })

  it('should_name_the_origin_when_the_network_fails', async () => {
    // Arrange
    let fetch = vi.fn(() => Promise.reject(new Error('ECONNREFUSED')))

    // Act
    let request = requestThemeSource({ apiBase: API_BASE, pass: 'p', fetch })

    // Assert
    await expect(request).rejects.toThrow(UNREACHABLE_ERROR)
  })
})

describe('downloadThemeSource', () => {
  it('should_return_the_bytes_when_the_sha256_matches', async () => {
    // Arrange
    let zip = Buffer.from('zip-bytes')
    let fetch = vi.fn(async () => new Response(zip))

    // Act
    let result = await downloadThemeSource({
      url: 'https://r2.test/x',
      sha256: sha256(zip).toUpperCase(),
      fetch,
    })

    // Assert
    expect(result.equals(zip)).toBe(true)
  })

  it('should_abort_when_the_sha256_does_not_match', async () => {
    // Arrange
    let fetch = vi.fn(async () => new Response(Buffer.from('tampered')))

    // Act
    let download = downloadThemeSource({
      url: 'https://r2.test/x',
      sha256: 'b'.repeat(64),
      fetch,
    })

    // Assert
    await expect(download).rejects.toThrow(INTEGRITY_ERROR)
  })
})

describe('planThemeSourceFiles', () => {
  it('should_keep_paths_when_the_project_is_at_the_zip_root', () => {
    // Arrange
    let entries = [
      fileEntry('package.json', '{}'),
      { path: 'app/', type: 'directory', mode: 0o755 },
      fileEntry('app/root.tsx'),
    ]

    // Act
    let result = planThemeSourceFiles(entries).map((file) => file.path)

    // Assert
    expect(result).toEqual(['package.json', 'app/root.tsx'])
  })

  it('should_strip_the_folder_when_the_project_is_inside_one_top_level_folder', () => {
    // Arrange
    let entries = [
      { path: 'aurora-1.0.0/', type: 'directory', mode: 0o755 },
      fileEntry('aurora-1.0.0/package.json', '{}'),
      fileEntry('aurora-1.0.0/app/root.tsx'),
      fileEntry('README.txt'),
      fileEntry('__MACOSX/aurora-1.0.0/._package.json'),
    ]

    // Act
    let result = planThemeSourceFiles(entries).map((file) => file.path)

    // Assert
    expect(result).toEqual(['package.json', 'app/root.tsx'])
  })

  it.each([
    '../outside.txt',
    'theme/../../outside.txt',
    '/etc/passwd',
    'C:/Windows/evil.txt',
    'theme\\..\\evil.txt',
  ])('should_reject_the_zip_when_an_entry_path_is_%s', (unsafePath) => {
    // Arrange
    let entries = [fileEntry('package.json', '{}'), fileEntry(unsafePath)]

    // Act
    let plan = () => planThemeSourceFiles(entries)

    // Assert
    expect(plan).toThrow(UNSAFE_PATH_ERROR)
  })

  it('should_reject_the_zip_when_it_contains_a_symlink', () => {
    // Arrange
    let entries = [
      fileEntry('package.json', '{}'),
      { path: 'secrets', type: 'symlink', linkname: '/etc', mode: 0o777 },
    ]

    // Act
    let plan = () => planThemeSourceFiles(entries)

    // Assert
    expect(plan).toThrow(LINK_ERROR)
  })
})

describe('extractThemeSource', () => {
  let workDir

  beforeEach(async () => {
    workDir = await mkdtemp(path.join(tmpdir(), 'weaverse-cli-source-'))
  })

  afterEach(async () => {
    await fs.remove(workDir)
  })

  it('should_unpack_a_single_folder_zip_into_the_project_root', async () => {
    // Arrange
    let zip = buildZip([
      { name: 'aurora-main/' },
      { name: 'aurora-main/package.json', data: '{"name":"aurora"}' },
      { name: 'aurora-main/app/root.tsx', data: 'export {}' },
    ])
    let outputPath = path.join(workDir, 'aurora')

    // Act
    await extractThemeSource(zip, outputPath)

    // Assert
    expect(
      await fs.readFile(path.join(outputPath, 'app/root.tsx'), 'utf8')
    ).toBe('export {}')
  })

  it('should_unpack_a_root_zip_as_is', async () => {
    // Arrange
    let zip = buildZip([
      { name: 'package.json', data: '{"name":"aurora"}' },
      { name: 'app/root.tsx', data: 'export {}' },
    ])
    let outputPath = path.join(workDir, 'aurora')

    // Act
    await extractThemeSource(zip, outputPath)

    // Assert
    expect((await fs.readdir(outputPath)).sort()).toEqual([
      'app',
      'package.json',
    ])
  })

  it('should_write_nothing_when_the_zip_contains_a_symlink', async () => {
    // Arrange
    let zip = buildZip([
      { name: 'package.json', data: '{}' },
      { name: 'etc', symlink: '/etc' },
    ])
    let outputPath = path.join(workDir, 'aurora')

    // Act
    let extraction = extractThemeSource(zip, outputPath)

    // Assert
    await expect(extraction).rejects.toThrow(LINK_ERROR)
    expect(await fs.pathExists(outputPath)).toBe(false)
  })

  it('should_write_nothing_outside_when_an_entry_traverses_up', async () => {
    // Arrange
    let zip = buildZip([
      { name: 'package.json', data: '{}' },
      { name: '../escaped.txt', data: 'x' },
    ])
    let outputPath = path.join(workDir, 'aurora')

    // Act
    let extraction = extractThemeSource(zip, outputPath)

    // Assert
    await expect(extraction).rejects.toThrow(UNPACK_ERROR)
    expect(await fs.readdir(workDir)).toEqual([])
  })

  it('should_create_folders_when_folder_entries_have_no_mode_bits', async () => {
    // Arrange
    let zip = buildZip([
      { name: 'theme/', noMode: true },
      { name: 'theme/package.json', data: '{}' },
      { name: 'theme/app/', noMode: true },
      { name: 'theme/app/root.tsx', data: 'export {}' },
    ])
    let outputPath = path.join(workDir, 'aurora')

    // Act
    await extractThemeSource(zip, outputPath)

    // Assert
    expect(
      await fs.readFile(path.join(outputPath, 'app/root.tsx'), 'utf8')
    ).toBe('export {}')
  })

  it('should_write_nothing_when_the_zip_has_too_many_entries', async () => {
    // Arrange
    let zip = buildZip([
      { name: 'package.json', data: '{}' },
      { name: 'a.txt', data: 'a' },
      { name: 'b.txt', data: 'b' },
    ])
    let outputPath = path.join(workDir, 'aurora')
    let limits = { maxBytes: ZIP_LIMITS.maxBytes, maxEntries: 2 }

    // Act
    let extraction = extractThemeSource(zip, outputPath, { limits })

    // Assert
    await expect(extraction).rejects.toThrow(TOO_MANY_ENTRIES_ERROR)
    expect(await fs.readdir(workDir)).toEqual([])
  })

  it('should_write_nothing_when_the_zip_unpacks_past_the_size_limit', async () => {
    // Arrange
    let zip = buildZip([
      { name: 'package.json', data: '{}' },
      { name: 'big.txt', data: 'x'.repeat(64) },
    ])
    let outputPath = path.join(workDir, 'aurora')
    let limits = { maxBytes: 32, maxEntries: ZIP_LIMITS.maxEntries }

    // Act
    let extraction = extractThemeSource(zip, outputPath, { limits })

    // Assert
    await expect(extraction).rejects.toThrow(TOO_LARGE_ERROR)
    expect(await fs.readdir(workDir)).toEqual([])
  })
})

describe('detectThemeSetup', () => {
  let workDir

  beforeEach(async () => {
    workDir = await mkdtemp(path.join(tmpdir(), 'weaverse-cli-setup-'))
  })

  afterEach(async () => {
    await fs.remove(workDir)
  })

  it('should_use_bun_and_the_dev_port_when_the_theme_declares_them', async () => {
    // Arrange
    await fs.writeFile(path.join(workDir, 'bun.lock'), '')
    await fs.writeJson(path.join(workDir, 'package.json'), {
      scripts: { dev: 'shopify hydrogen dev --codegen --port 3456' },
    })

    // Act
    let result = await detectThemeSetup(workDir)

    // Assert
    expect(result).toEqual({ packageManager: 'bun', devPort: 3456 })
  })

  it('should_default_to_npm_and_port_3000_when_nothing_is_declared', async () => {
    // Act
    let result = await detectThemeSetup(workDir)

    // Assert
    expect(result).toEqual({ packageManager: 'npm', devPort: 3000 })
  })
})

describe('createProjectFromPass', () => {
  let workDir
  let originalCwd = process.cwd()

  beforeEach(async () => {
    workDir = await mkdtemp(path.join(tmpdir(), 'weaverse-cli-pass-'))
    process.chdir(workDir)
    vi.spyOn(console, 'log').mockImplementation(() => undefined)
  })

  afterEach(async () => {
    process.chdir(originalCwd)
    vi.restoreAllMocks()
    await fs.remove(workDir)
  })

  let mockFetch = (zip, body = {}) =>
    vi.fn(async (url) =>
      url.endsWith('/api/public/theme-source')
        ? jsonResponse(200, sourceBody({ sha256: sha256(zip), ...body }))
        : new Response(zip)
    )

  it('should_create_the_project_in_the_handle_folder_with_the_project_id', async () => {
    // Arrange
    let zip = buildZip([
      { name: 'aurora/package.json', data: '{"name":"aurora"}' },
      { name: 'aurora/.env.example', data: 'WEAVERSE_PROJECT_ID=\n' },
    ])
    let argv = { pass: 'p4ss', 'project-id': 'proj-1', install: false }

    // Act
    await createProjectFromPass(argv, {
      nonInteractive: true,
      fetch: mockFetch(zip),
    })

    // Assert
    expect(await fs.readFile('aurora/.env', 'utf8')).toContain(
      'WEAVERSE_PROJECT_ID=proj-1'
    )
  })

  it('should_leave_no_folder_when_the_sha256_does_not_match', async () => {
    // Arrange
    let zip = buildZip([{ name: 'package.json', data: '{}' }])
    let fetch = mockFetch(zip, { sha256: 'c'.repeat(64) })

    // Act
    let creation = createProjectFromPass(
      { pass: 'p4ss', install: false },
      { nonInteractive: true, fetch }
    )

    // Assert
    await expect(creation).rejects.toThrow(INTEGRITY_ERROR)
    expect(await fs.readdir(workDir)).toEqual([])
  })

  it('should_not_spend_the_pass_when_combined_with_template', async () => {
    // Arrange
    let fetch = vi.fn()

    // Act
    let creation = createProjectFromPass(
      { pass: 'p4ss', template: 'pilot' },
      { nonInteractive: true, fetch }
    )

    // Assert
    await expect(creation).rejects.toThrow(COMBINED_FLAGS_ERROR)
    expect(fetch).not.toHaveBeenCalled()
  })

  it('should_not_spend_the_pass_when_the_named_folder_is_not_empty', async () => {
    // Arrange
    await fs.outputFile('shop/keep.txt', 'mine')
    let fetch = vi.fn()

    // Act
    let creation = createProjectFromPass(
      { pass: 'p4ss', 'project-name': 'shop' },
      { nonInteractive: true, fetch }
    )

    // Assert
    await expect(creation).rejects.toThrow(FORCE_HINT_ERROR)
    expect(fetch).not.toHaveBeenCalled()
  })
})
