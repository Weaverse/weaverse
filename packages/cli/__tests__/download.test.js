import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import path from 'node:path'
import fs from 'fs-extra'
import { removeWeaverseFolder } from '../src/utils/download.js'

describe('removeWeaverseFolder', () => {
  let testDir = './test-project'

  beforeEach(async () => {
    await fs.ensureDir(testDir)
  })

  afterEach(async () => {
    await fs.remove(testDir)
  })

  it('should remove .weaverse folder if it exists', async () => {
    // Arrange
    let weaversePath = path.join(testDir, '.weaverse')
    await fs.ensureDir(weaversePath)
    await fs.writeFile(path.join(weaversePath, 'config.json'), '{}')

    // Act
    let result = await removeWeaverseFolder(testDir)

    // Assert
    expect(result).toBe(true)
    expect(await fs.pathExists(weaversePath)).toBe(false)
  })

  it('should return true if .weaverse folder does not exist', async () => {
    // Act
    let result = await removeWeaverseFolder(testDir)

    // Assert
    expect(result).toBe(true)
  })
})
