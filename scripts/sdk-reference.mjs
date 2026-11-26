// Generates the TypeDoc JSON that docs.weaverse.io renders as the SDK reference
// (Mintlify `sdk` groups), one artifact per framework adapter of
// `@weaverse/hydrogen`. Each adapter entry re-exports the core and `/react`, so
// those have no artifact of their own; `/internal` is not documented. Sibling
// @weaverse packages resolve to their sources through tsconfig.typedoc.json, so
// each artifact documents this commit.
//
// Usage: pnpm sdk:reference [outDir]
import { execFileSync } from 'node:child_process'

const OUT_DIR = process.argv[2] ?? 'sdk-reference'
const ARTIFACTS = [
  {
    name: 'react-router',
    entryPoints: ['packages/hydrogen/src/react-router.ts'],
  },
  {
    name: 'next',
    entryPoints: [
      'packages/hydrogen/src/next.ts',
      'packages/hydrogen/src/next-server.ts',
    ],
  },
]

for (let { name, entryPoints } of ARTIFACTS) {
  execFileSync(
    'typedoc',
    [
      '--options',
      'typedoc.json',
      '--json',
      `${OUT_DIR}/${name}.json`,
      ...entryPoints,
    ],
    { stdio: 'inherit' }
  )
}
