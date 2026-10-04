import path from 'node:path'
import fs from 'fs-extra'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { removeTemplateInternalFolders } from '../src/utils/download.js'

describe('removeTemplateInternalFolders', () => {
  let testDir = './test-project'

  beforeEach(async () => {
    await fs.ensureDir(testDir)
  })

  afterEach(async () => {
    await fs.remove(testDir)
  })

  it('should remove .weaverse and .github folders if they exist', async () => {
    // Arrange
    let weaversePath = path.join(testDir, '.weaverse')
    let workflowsPath = path.join(testDir, '.github', 'workflows')
    let appPath = path.join(testDir, 'app')
    await fs.ensureDir(weaversePath)
    await fs.writeFile(path.join(weaversePath, 'config.json'), '{}')
    await fs.ensureDir(workflowsPath)
    await fs.writeFile(path.join(workflowsPath, 'ci.yml'), 'on: [push]')
    await fs.ensureDir(appPath)

    // Act
    let result = await removeTemplateInternalFolders(testDir)

    // Assert
    expect(result).toBe(true)
    expect(await fs.pathExists(weaversePath)).toBe(false)
    expect(await fs.pathExists(path.join(testDir, '.github'))).toBe(false)
    expect(await fs.pathExists(appPath)).toBe(true)
  })

  it('should return true if the folders do not exist', async () => {
    // Act
    let result = await removeTemplateInternalFolders(testDir)

    // Assert
    expect(result).toBe(true)
  })
})
