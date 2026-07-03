import fs from 'fs-extra'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createEnvFile } from '../src/utils/environment.js'
import { validateProjectName } from '../src/utils/validation.js'

const SESSION_SECRET_PATTERN = /^SESSION_SECRET="([a-f0-9]{64})"$/m

describe('createEnvFile', () => {
  let testDir = './test-env-project'

  beforeEach(async () => {
    await fs.ensureDir(testDir)
  })

  afterEach(async () => {
    await fs.remove(testDir)
  })

  it('injects project id and generates a secure session secret', async () => {
    await fs.writeFile(
      `${testDir}/.env.example`,
      [
        'SESSION_SECRET="foobar"',
        'PUBLIC_STORE_DOMAIN=weaverse-hydrogen.myshopify.com',
        'WEAVERSE_PROJECT_ID=demo-project',
      ].join('\n')
    )

    await createEnvFile(testDir, 'merchant-project')

    let env = await fs.readFile(`${testDir}/.env`, 'utf8')
    let secret = env.match(SESSION_SECRET_PATTERN)?.[1]

    expect(env).toContain('WEAVERSE_PROJECT_ID=merchant-project')
    expect(secret).toBeTruthy()
    expect(secret).not.toBe('foobar')
  })
})

describe('validateProjectName (guards the overwrite/emptyDir path)', () => {
  it('rejects traversal and separator names, accepts kebab names', () => {
    expect(validateProjectName('..')).not.toBe(true)
    expect(validateProjectName('../evil')).not.toBe(true)
    expect(validateProjectName('foo/bar')).not.toBe(true)
    expect(validateProjectName('foo\\bar')).not.toBe(true)
    expect(validateProjectName('good-name')).toBe(true)
  })
})
