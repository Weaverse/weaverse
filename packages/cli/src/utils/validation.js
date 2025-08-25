import path from 'node:path'
import fs from 'fs-extra'
import validateNpmPackageName from 'validate-npm-package-name'

/**
 * Validates a project ID for proper format (kebab-case, length constraints)
 * @param {string} input - The project ID to validate
 * @returns {string|boolean} Error message string if invalid, true if valid
 */
export let validateProjectId = (input) => {
  if (!input || input.trim().length === 0) {
    return 'Project ID is required'
  }

  let trimmed = input.trim()

  // Check basic format - should be kebab-case
  if (!/^[a-z0-9-]+$/.test(trimmed)) {
    return 'Project ID should only contain lowercase letters, numbers, and hyphens'
  }

  // Cannot start or end with hyphen
  if (trimmed.startsWith('-') || trimmed.endsWith('-')) {
    return 'Project ID cannot start or end with a hyphen'
  }

  // Cannot have consecutive hyphens
  if (trimmed.includes('--')) {
    return 'Project ID cannot contain consecutive hyphens'
  }

  // Minimum length
  if (trimmed.length < 3) {
    return 'Project ID must be at least 3 characters long'
  }

  // Maximum length
  if (trimmed.length > 50) {
    return 'Project ID must be 50 characters or less'
  }

  return true
}

/**
 * Validates a project name for npm package compatibility and directory safety
 * @param {string} input - The project name to validate
 * @returns {string|boolean} Error message string if invalid, true if valid
 */
export let validateProjectName = (input) => {
  if (!input || input.trim().length === 0) {
    return 'Project name is required'
  }

  let trimmed = input.trim()

  // Use npm package name validation as a baseline
  let npmValidation = validateNpmPackageName(trimmed)
  if (!npmValidation.validForNewPackages) {
    let errors = npmValidation.errors || []
    let warnings = npmValidation.warnings || []
    let allIssues = [...errors, ...warnings]

    if (allIssues.length > 0) {
      return `Invalid project name: ${allIssues[0]}`
    }
  }

  // Additional checks for directory names
  if (trimmed.includes(' ')) {
    return 'Project name cannot contain spaces (use hyphens instead)'
  }

  if (trimmed.includes('/') || trimmed.includes('\\')) {
    return 'Project name cannot contain path separators'
  }

  return true
}

/**
 * Validates a Git commit hash format (7-40 hexadecimal characters)
 * @param {string} input - The commit hash to validate (optional)
 * @returns {string|boolean} Error message string if invalid, true if valid
 */
export let validateCommitHash = (input) => {
  if (!input) {
    return true // Optional field
  }

  let trimmed = input.trim()

  // Git commit hash should be 7-40 characters, hexadecimal
  if (!/^[a-f0-9]{7,40}$/i.test(trimmed)) {
    return 'Commit hash should be 7-40 hexadecimal characters'
  }

  return true
}

/**
 * Checks if a directory exists and provides detailed status information
 * @param {string} projectPath - The directory path to check
 * @returns {Promise<Object>} Object with exists, isEmpty, message, and optional error properties
 */
export let checkDirectoryExists = async (projectPath) => {
  try {
    let exists = await fs.pathExists(projectPath)
    if (exists) {
      let stats = await fs.stat(projectPath)
      if (stats.isDirectory()) {
        let files = await fs.readdir(projectPath)
        if (files.length > 0) {
          return {
            exists: true,
            isEmpty: false,
            message: `Directory '${path.basename(projectPath)}' already exists and is not empty`,
          }
        }
        return {
          exists: true,
          isEmpty: true,
          message: `Directory '${path.basename(projectPath)}' already exists but is empty`,
        }
      }
      return {
        exists: true,
        isEmpty: false,
        message: `A file named '${path.basename(projectPath)}' already exists`,
      }
    }
    return { exists: false }
  } catch (error) {
    return {
      exists: false,
      error: error.message,
    }
  }
}
