import { describe, expect, it } from 'vitest'

describe('zod config', () => {
  it('should_disable_zod_jit_when_the_package_is_imported', async () => {
    // Arrange
    let { z } = await import('../src/index')

    // Act
    let { jitless } = z.config()

    // Assert
    expect(jitless).toBe(true)
  })
})
