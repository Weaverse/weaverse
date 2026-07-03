import { describe, expect, it } from 'vitest'
import { isNonInteractive } from '../src/commands/create.js'
import {
  defaultProjectName,
  promptForMissingOptions,
} from '../src/prompts/createPrompts.js'

describe('isNonInteractive', () => {
  it('is true when --yes is passed', () => {
    expect(isNonInteractive({ yes: true })).toBe(true)
  })

  it('is true when --ci is passed', () => {
    expect(isNonInteractive({ ci: true })).toBe(true)
  })
})

describe('defaultProjectName', () => {
  it('derives a dated folder name from the template', () => {
    expect(defaultProjectName('maison')).toMatch(
      /^maison-project-\d{4}-\d{2}-\d{2}$/
    )
  })

  it('falls back to a generic base when no template is given', () => {
    expect(defaultProjectName()).toMatch(/^weaverse-project-/)
  })
})

describe('promptForMissingOptions (non-interactive)', () => {
  let opts = { nonInteractive: true }

  it('returns the args unchanged when everything is provided', async () => {
    let argv = {
      template: 'maison',
      'project-id': 'kt64nx87mya36ee63h7ir473',
      'project-name': 'my-storefront',
    }

    let result = await promptForMissingOptions(argv, opts)

    expect(result).toEqual(argv)
  })

  it('defaults only the project-name without prompting', async () => {
    let argv = { template: 'naturelle', 'project-id': 'abc-987' }

    let result = await promptForMissingOptions(argv, opts)

    expect(result.template).toBe('naturelle')
    expect(result['project-id']).toBe('abc-987')
    expect(result['project-name']).toMatch(/^naturelle-project-/)
  })

  it('throws listing every missing required option', async () => {
    await expect(promptForMissingOptions({}, opts)).rejects.toThrow(
      /--template/
    )
    await expect(promptForMissingOptions({}, opts)).rejects.toThrow(
      /--project-id/
    )
  })

  it('throws for a missing project-id even when the template is set', async () => {
    // The missing-list (before the period) must contain project-id only —
    // template is present, so it isn't listed. The example command that
    // follows does mention --template, hence the precise anchored match.
    await expect(
      promptForMissingOptions({ template: 'pilot' }, opts)
    ).rejects.toThrow(/non-interactive run: --project-id\./)
  })
})

describe('--no-install flag shape', () => {
  it("createProject treats yargs' install === false as skip-install", async () => {
    // yargs parses `--no-install` into { install: false }; the literal
    // 'no-install' key is never set. Guard against regressing to only
    // checking options['no-install'] (which silently installs everything).
    let source = await import('node:fs/promises').then((fs) =>
      fs.readFile(new URL('../src/commands/create.js', import.meta.url), 'utf8')
    )
    expect(source).toContain("options.install === false")
  })
})
