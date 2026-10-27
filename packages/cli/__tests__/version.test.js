import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('--version', () => {
  it('prints the version from package.json', () => {
    let { version } = JSON.parse(
      readFileSync(new URL('../package.json', import.meta.url), 'utf8')
    )
    let output = execFileSync(
      process.execPath,
      [new URL('../index.js', import.meta.url).pathname, '--version'],
      { encoding: 'utf8' }
    )

    expect(output.trim()).toBe(version)
  })
})
