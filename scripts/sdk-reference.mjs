// Generates the TypeDoc JSON that docs.weaverse.io renders as the SDK reference
// (Mintlify `sdk` groups). Sibling @weaverse packages resolve to their sources
// through tsconfig.typedoc.json, so each artifact documents this commit.
//
// Usage: pnpm sdk:reference [outDir]
import { execFileSync } from 'node:child_process'

const OUT_DIR = process.argv[2] ?? 'sdk-reference'
const ARTIFACTS = [
  { name: 'hydrogen', entryPoints: ['packages/hydrogen/src/index.ts'] },
  {
    name: 'next',
    entryPoints: ['packages/next/src/index.ts', 'packages/next/src/server.ts'],
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
