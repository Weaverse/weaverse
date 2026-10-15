import fs from 'fs-extra'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getDownloadFolder, TEMPLATES } from '../src/constants/templates.js'
import { ensureBun } from '../src/utils/bun.js'
import { createEnvFile } from '../src/utils/environment.js'
import {
  getDevCommand,
  getInstallCommand,
  getNextSteps,
} from '../src/utils/install.js'

const FORWARD_DEV_PORT = 3333
/** Numbered steps, before the explanatory notes. */
const STEP_COUNT = 4
const HYDROGEN_DEV_PORT = 3456
const NON_INTERACTIVE_BUN_ERROR =
  /requires Bun[\s\S]*npm install -g bun[\s\S]*--no-install/
const DECLINED_BUN_ERROR = /Bun is required[\s\S]*bun\.sh\/install/
const FAILED_BUN_INSTALL_ERROR = /could not be installed/

let forward = TEMPLATES.find((t) => t.name === 'forward')
let pilot = TEMPLATES.find((t) => t.name === 'pilot')

describe('template metadata', () => {
  it('lists Forward as a Bun-installed Next.js template', () => {
    expect(forward).toMatchObject({
      repoURL: 'https://github.com/Weaverse/forward',
      framework: 'nextjs',
      packageManager: 'bun',
      devPort: FORWARD_DEV_PORT,
    })
    expect(getDownloadFolder(forward)).toBe('forward-main')
  })

  it('keeps every Hydrogen template on npm and port 3456', () => {
    for (let template of TEMPLATES.filter((t) => t.name !== 'forward')) {
      expect(template).toMatchObject({
        framework: 'hydrogen',
        packageManager: 'npm',
        devPort: HYDROGEN_DEV_PORT,
      })
    }
  })
})

describe('install and dev commands', () => {
  it('installs Forward with Bun and Hydrogen templates with npm', () => {
    expect(getInstallCommand(forward)).toEqual({
      command: 'bun',
      args: ['install'],
    })
    expect(getInstallCommand(pilot)).toEqual({
      command: 'npm',
      args: ['install', '--legacy-peer-deps'],
    })
  })

  it('starts the dev server with the template package manager', () => {
    expect(getDevCommand(forward)).toBe('bun run dev')
    expect(getDevCommand(pilot)).toBe('npm run dev')
  })
})

describe('next steps', () => {
  it('keeps the Hydrogen steps as they were', () => {
    expect(getNextSteps('shop', pilot)).toEqual([
      '1. cd shop',
      '2. npm run dev',
      '3. Open http://localhost:3456 in your browser',
      '',
      'The demo store works out of the box. To connect your own Shopify store later:',
      '- Store on a Shopify plan: install the Hydrogen sales channel (https://apps.shopify.com/hydrogen),',
      '  create a Hydrogen storefront, then run: npx shopify hydrogen env pull',
      '- Development store: install the Headless sales channel (https://apps.shopify.com/headless)',
      '  and copy the Storefront API values into .env',
    ])
    expect(
      getNextSteps('shop', pilot, { installed: false }).slice(0, STEP_COUNT)
    ).toEqual([
      '1. cd shop',
      '2. npm install',
      '3. npm run dev',
      '4. Open http://localhost:3456 in your browser',
    ])
  })

  it('asks for the Shopify keys and uses Bun and port 3333 for Forward', () => {
    let steps = getNextSteps('shop', forward)
    expect(steps.slice(0, STEP_COUNT)).toEqual([
      '1. cd shop',
      '2. Add your Shopify Storefront API keys to .env: PUBLIC_STORE_DOMAIN, PRIVATE_STOREFRONT_API_TOKEN and PUBLIC_STOREFRONT_API_TOKEN',
      '3. bun run dev',
      '4. Open http://localhost:3333 and connect it in Weaverse Studio',
    ])
    expect(steps.join('\n')).toContain(
      'https://weaverse.io/docs/nextjs/quickstart'
    )
    expect(steps.join('\n')).not.toContain('hydrogen env pull')
    expect(getNextSteps('shop', forward, { installed: false })[1]).toBe(
      '2. bun install'
    )
  })
})

describe('ensureBun', () => {
  it('does nothing when Bun is installed', async () => {
    let confirm = vi.fn()
    let install = vi.fn()
    await ensureBun({
      nonInteractive: false,
      confirm,
      check: () => true,
      install,
    })
    expect(confirm).not.toHaveBeenCalled()
    expect(install).not.toHaveBeenCalled()
  })

  it('never installs in a non-interactive run and explains how', async () => {
    let install = vi.fn()
    await expect(
      ensureBun({
        nonInteractive: true,
        confirm: vi.fn(),
        check: () => false,
        install,
      })
    ).rejects.toThrow(NON_INTERACTIVE_BUN_ERROR)
    expect(install).not.toHaveBeenCalled()
  })

  it('installs Bun when the user accepts', async () => {
    let installed = false
    await ensureBun({
      nonInteractive: false,
      confirm: async () => true,
      check: () => installed,
      install: () => {
        installed = true
        return true
      },
    })
    expect(installed).toBe(true)
  })

  it('stops with instructions when the user declines', async () => {
    let install = vi.fn()
    await expect(
      ensureBun({
        nonInteractive: false,
        confirm: async () => false,
        check: () => false,
        install,
      })
    ).rejects.toThrow(DECLINED_BUN_ERROR)
    expect(install).not.toHaveBeenCalled()
  })

  it('fails when the install does not leave a working Bun', async () => {
    await expect(
      ensureBun({
        nonInteractive: false,
        confirm: async () => true,
        check: () => false,
        install: () => true,
      })
    ).rejects.toThrow(FAILED_BUN_INSTALL_ERROR)
  })
})

describe('createEnvFile for Forward', () => {
  let testDir = './test-env-forward'

  beforeEach(async () => {
    await fs.ensureDir(testDir)
  })

  afterEach(async () => {
    await fs.remove(testDir)
  })

  it('sets the project id without adding a SESSION_SECRET', async () => {
    await fs.writeFile(
      `${testDir}/.env.example`,
      [
        'PUBLIC_STORE_DOMAIN=your-shop.myshopify.com',
        'WEAVERSE_PROJECT_ID=',
      ].join('\n')
    )

    await createEnvFile(testDir, 'merchant-project', { sessionSecret: false })

    let env = await fs.readFile(`${testDir}/.env`, 'utf8')
    expect(env).toContain('WEAVERSE_PROJECT_ID=merchant-project')
    expect(env).not.toContain('SESSION_SECRET')
  })
})
