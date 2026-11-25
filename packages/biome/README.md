# @weaverse/biome

> **Deprecated.** Weaverse projects now use [Vite+](https://viteplus.dev/guide/check)
> (Oxlint and Oxfmt) for linting and formatting. Version 5.8.0 stays available
> for existing projects until they migrate; it will not receive further updates.

Shared [Biome](https://biomejs.dev) configuration for Weaverse projects, built
on the ultracite core, React and Remix presets.

## Usage

```sh
pnpm add -D @weaverse/biome @biomejs/biome ultracite
```

```json
{
  "extends": ["@weaverse/biome"]
}
```

## Migrating to Vite+

Replace Biome with `vite-plus` and move the rules you rely on into the `lint`
and `fmt` blocks of `vite.config.ts`. The Weaverse SDK monorepo's root
`vite.config.ts` maps this preset's rules to Oxlint at the same severities and
can serve as a starting point.
