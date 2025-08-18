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

export const getDownloadURL = (template, commitHash) => {
  if (commitHash) {
    return `${template.repoURL}/archive/${commitHash}.zip`
  }
  return `${template.repoURL}/archive/refs/heads/main.zip`
}

export const getDownloadFolder = (template, commitHash) => {
  if (commitHash) {
    return `${template.name}-${commitHash}`
  }
  return template.defaultDownloadFolder
}
