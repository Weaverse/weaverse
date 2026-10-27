import chalk from 'chalk'
import spawn from 'cross-spawn'

/** How to install Bun by hand, shown whenever the CLI cannot do it. */
export let BUN_INSTALL_INSTRUCTIONS = [
  'Install Bun, then run this command again:',
  '  npm install -g bun',
  '  # or: curl -fsSL https://bun.sh/install | bash',
  '  # Windows: powershell -c "irm bun.sh/install.ps1 | iex"',
  'Or pass --no-install to download the template without installing dependencies.',
].join('\n')

/**
 * Whether a working `bun` executable is on the PATH.
 * @returns {boolean}
 */
export let hasBun = () => {
  let result = spawn.sync('bun', ['--version'], { stdio: 'ignore' })
  return result.status === 0 && !result.error
}

/**
 * Installs Bun globally through npm, which every CLI user already has.
 *
 * `--allow-scripts=bun` approves Bun's postinstall up front: npm 11 otherwise
 * prints an install-scripts warning that looks like a failure, and npm 10
 * accepts the flag silently.
 * @returns {boolean} Whether the install command succeeded
 */
export let installBun = () => {
  let result = spawn.sync(
    'npm',
    ['install', '-g', '--allow-scripts=bun', 'bun'],
    {
      stdio: 'inherit',
    }
  )
  return result.status === 0 && !result.error
}

/**
 * Makes sure Bun is available before a Bun template is downloaded.
 *
 * Interactive runs offer to install it; non-interactive runs never install
 * anything on the user's machine and fail with instructions instead.
 *
 * @param {Object} options
 * @param {boolean} options.nonInteractive - No one to ask
 * @param {() => Promise<boolean>} options.confirm - Asks whether to install Bun
 * @param {() => boolean} [options.check] - Bun detection (injectable for tests)
 * @param {() => boolean} [options.install] - Bun installer (injectable for tests)
 * @returns {Promise<void>} Resolves when Bun is available
 * @throws {Error} When Bun is missing and was not installed
 */
export let ensureBun = async ({
  nonInteractive,
  confirm,
  check = hasBun,
  install = installBun,
}) => {
  if (check()) {
    return
  }
  if (nonInteractive) {
    throw new Error(`This template requires Bun.\n${BUN_INSTALL_INSTRUCTIONS}`)
  }
  if (!(await confirm())) {
    throw new Error(
      `Bun is required for this template.\n${BUN_INSTALL_INSTRUCTIONS}`
    )
  }
  console.log(chalk.blue('\nInstalling Bun with npm install -g bun...\n'))
  if (!(install() && check())) {
    throw new Error(
      `Bun could not be installed. If npm needs elevated permissions, or its global bin directory (npm prefix -g) is not on your PATH, install Bun another way.\n${BUN_INSTALL_INSTRUCTIONS}`
    )
  }
}
