import spawn from 'cross-spawn'
import { describe, expect, it, vi } from 'vitest'
import { installBun } from '../src/utils/bun.js'

vi.mock('cross-spawn', () => ({
  default: { sync: vi.fn(() => ({ status: 0 })) },
}))

describe('installBun', () => {
  it('should_approve_the_bun_postinstall_when_installing_through_npm', () => {
    installBun()

    expect(spawn.sync).toHaveBeenCalledWith(
      'npm',
      ['install', '-g', '--allow-scripts=bun', 'bun'],
      { stdio: 'inherit' }
    )
  })
})
