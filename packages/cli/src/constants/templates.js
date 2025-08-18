/**
 * Available Weaverse templates with their configurations
 * @type {Array<Object>} Array of template configuration objects
 */
export const TEMPLATES = [
  {
    name: 'pilot',
    repoURL: 'https://github.com/Weaverse/pilot',
    defaultDownloadFolder: 'pilot-main',
    description:
      'A fully-featured Shopify Hydrogen theme crafted to help you launch modern, high-performing headless storefronts in minutes.',
    demoUrl: 'https://pilot.weaverse.dev',
  },
  {
    name: 'naturelle',
    repoURL: 'https://github.com/Weaverse/naturelle',
    defaultDownloadFolder: 'naturelle-main',
    description:
      'Naturelle is a state-of-the-art Shopify theme, crafted specifically for beauty brands.',
    demoUrl: 'https://naturelle.weaverse.dev',
  },
  {
    name: 'aspen',
    repoURL: 'https://github.com/Weaverse/aspen',
    defaultDownloadFolder: 'aspen-main',
    description:
      'A sophisticated Shopify Hydrogen theme designed for home furniture and interior design stores.',
    demoUrl: 'https://weaverse-aspen-furniture.fly.dev',
  },
]

/**
 * Generates the download URL for a template repository
 * @param {Object} template - Template configuration object
 * @param {string} [commitHash] - Specific commit hash (optional, defaults to main branch)
 * @returns {string} The complete download URL for the template
 */
export const getDownloadURL = (template, commitHash) => {
  if (commitHash) {
    return `${template.repoURL}/archive/${commitHash}.zip`
  }
  return `${template.repoURL}/archive/refs/heads/main.zip`
}

/**
 * Generates the expected folder name after template extraction
 * @param {Object} template - Template configuration object
 * @param {string} [commitHash] - Specific commit hash (optional)
 * @returns {string} The folder name that will be created after extraction
 */
export const getDownloadFolder = (template, commitHash) => {
  if (commitHash) {
    return `${template.name}-${commitHash}`
  }
  return template.defaultDownloadFolder
}
