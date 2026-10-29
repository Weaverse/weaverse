import os from 'node:os'
import path from 'node:path'
import fs from 'fs-extra'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { validateWritableDirectory } from '../src/utils/validation.js'

const WRITABLE_MODE = 0o755
const READ_ONLY_MODE = 0o555
const NOT_WRITABLE_ERROR = /Cannot create a project in .*write access/

describe('validateWritableDirectory', () => {
  let directory

  beforeEach(async () => {
    directory = await fs.mkdtemp(path.join(os.tmpdir(), 'weaverse-cli-'))
  })

  afterEach(async () => {
    await fs.chmod(directory, WRITABLE_MODE)
    await fs.remove(directory)
  })

  it('should_accept_a_directory_when_it_is_writable', async () => {
    let result = await validateWritableDirectory(directory)

    expect(result).toBe(true)
  })

  it.skipIf(process.getuid?.() === 0)(
    'should_explain_how_to_fix_it_when_the_directory_is_read_only',
    async () => {
      await fs.chmod(directory, READ_ONLY_MODE)

      let result = await validateWritableDirectory(directory)

      expect(result).toMatch(NOT_WRITABLE_ERROR)
    }
  )
})
