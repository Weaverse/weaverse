# `@weaverse/experiments`

Framework-agnostic A/B testing and experimentation for Weaverse. Opt-in: install
it only when you run experiments — it adds nothing to storefronts that don't.

- **Deterministic & storage-free** — the same visitor always lands in the same
  variant by hashing a stable seed. No per-experiment cookies, no flicker.
- **Framework-agnostic** — the engine and the request adapter use only web
  standards (`Request`, `Headers`, `crypto`). Works on Shopify Oxygen/Hydrogen,
  Cloudflare Workers, Next.js, Remix, Deno, and Bun.
- **No vendor lock-in** — exposure events are forwarded to *your* analytics
  (GA4, Segment, …). Nothing is bundled.
- **Project-level by design** — a variant maps to a Weaverse `projectId`, so an
  experiment swaps an entire theme/content project via the same multi-project
  primitive you already use.

## Install

```bash
npm i @weaverse/experiments
```

## Entry points

| Import | Deps | Use |
|---|---|---|
| `@weaverse/experiments` | none | Engine: `assignVariant`, `resolveExperiments`, `stableSeed`, `hashToBucket` |
| `@weaverse/experiments/server` | none | `getExperiments(request, config)` — resolve a request to assignments + a `projectId` |
| `@weaverse/experiments/react` | `react` (optional peer) | `<WeaverseExperiments>`, `useExperiment`, `useExperiments` |

The agnostic entry pulls **zero** dependencies; `react` loads only if you import
`/react`.

## Quick start (Shopify Hydrogen)

**1. Resolve the experiment server-side and feed the chosen project to the client.**

```ts
// app/lib/weaverse/weaverse.server.ts
import { getExperiments } from '@weaverse/experiments/server'
import { WeaverseClient } from '@weaverse/hydrogen'

export function createWeaverseClient(args) {
  let { hydrogenContext, request, cache, themeSchema, components } = args

  let { projectId, assignments, headers } = getExperiments(request, {
    experiments: [
      {
        id: 'green-theme-test',
        variants: [
          { id: 'control', projectId: args.env.WEAVERSE_PROJECT_CONTROL },
          { id: 'b', weight: 0.2, projectId: args.env.WEAVERSE_PROJECT_VARIANT_B },
        ],
      },
    ],
  })

  let weaverse = new WeaverseClient({
    ...hydrogenContext,
    request,
    cache,
    themeSchema,
    components,
    projectId, // winning variant's project
  })

  // `headers` carries a `Set-Cookie` only when a new visitor seed is minted —
  // merge it into your response, and pass `assignments` to the client.
  return { weaverse, assignments, headers }
}
```

**2. Provide assignments to React and forward exposure to analytics.**

```tsx
// app/root.tsx — App renders inside <Analytics.Provider> (see below)
import { useAnalytics } from '@shopify/hydrogen'
import { WeaverseExperiments } from '@weaverse/experiments/react'

export default function App() {
  let { assignments } = useLoaderData<typeof loader>()
  let { publish, canTrack } = useAnalytics()
  let tracking = canTrack()
  return (
    <WeaverseExperiments
      value={assignments}
      // Attach onExpose only once consent allows it. A sink that silently
      // no-ops (analytics not loaded yet, or consent withheld) would mark the
      // variant exposed without sending — and it never retries. See the
      // "Analytics integration" section for the full setup.
      onExpose={
        tracking
          ? (a) =>
              publish('custom_experiment_viewed', {
                experimentId: a.experimentId,
                variantId: a.variant.id,
              })
          : undefined
      }
    >
      <Outlet />
    </WeaverseExperiments>
  )
}
```

`onExpose` fires once per `(experiment, variant)` — wire it to any analytics
provider. Read the active variant anywhere with `useExperiment('green-theme-test')`.

## Analytics integration (Hydrogen)

For Hydrogen, integrate with [`Analytics.Provider`](https://shopify.dev/docs/api/hydrogen/hooks/useanalytics)
at two seams:

1. **Segment every event by variant** — pass assignments to `customData` so
   `page_viewed`, `product_added_to_cart`, `purchase`, … all carry the variant.
   That's how you measure conversion *impact*, not just impressions.
2. **Fire an exposure event** — forward `onExpose` to
   `useAnalytics().publish('custom_experiment_viewed', …)`, gated on consent via
   `canTrack()`.

```tsx
// app/root.tsx
import { Analytics, useAnalytics } from '@shopify/hydrogen'
import type { Assignment } from '@weaverse/experiments'
import { WeaverseExperiments } from '@weaverse/experiments/react'
import type { ReactNode } from 'react'

export default function App() {
  let { assignments, cart, shop, consent } = useLoaderData<typeof loader>()
  return (
    <Analytics.Provider
      cart={cart}
      shop={shop}
      consent={consent}
      customData={{
        experiments: Object.fromEntries(
          assignments.map((a) => [a.experimentId, a.variant.id])
        ),
      }}
    >
      <Experiments assignments={assignments}>
        <Outlet />
      </Experiments>
    </Analytics.Provider>
  )
}

// Wrapping the app is required: a self-closing <WeaverseExperiments /> provides
// its context to no descendants, so useExperiment(...) under the Outlet would
// read the empty default. Attach onExpose only once consent is granted —
// otherwise the provider marks a variant exposed before canTrack() is true and
// a later consent grant never re-publishes the impression.
function Experiments({
  assignments,
  children,
}: {
  assignments: Assignment[]
  children: ReactNode
}) {
  let { publish, canTrack } = useAnalytics()
  let tracking = canTrack()
  return (
    <WeaverseExperiments
      value={assignments}
      onExpose={
        tracking
          ? (a) => {
              publish('custom_experiment_viewed', {
                experimentId: a.experimentId,
                variantId: a.variant.id,
              })
            }
          : undefined
      }
    >
      {children}
    </WeaverseExperiments>
  )
}
```

Bridge the custom event to GA4/GTM (or any sink) from a subscriber. Custom event
names must be prefixed `custom_`; call `ready()` so events aren't dropped before
the subscriber attaches:

```tsx
// app/components/CustomAnalytics.tsx
import { useAnalytics } from '@shopify/hydrogen'
import { useEffect } from 'react'

export function CustomAnalytics() {
  let { subscribe, register } = useAnalytics()
  let { ready } = register('CustomAnalytics')
  useEffect(() => {
    subscribe('custom_experiment_viewed', (data) => {
      window.dataLayer?.push({ event: 'experiment_viewed', ...data })
    })
    ready()
  }, [])
  return null
}
```

## How assignment works

`assignVariant(experiment, seed)` hashes `"<id>:<salt>:<seed>"` with FNV-1a into a
bucket in `[0, 1)`, then picks a variant by cumulative weight. Because it's a pure
function of the seed, assignment is **sticky without persistence** — you only store
a stable visitor id once (the `_wv_vid` cookie minted by `getExperiments`, or any
id you supply via `config.seed`, e.g. a logged-in customer id or Shopify visitor
token). Adding more experiments needs no new storage.

```ts
import { assignVariant, resolveExperiments, stableSeed } from '@weaverse/experiments'

let experiment = {
  id: 'cta-color',
  variants: [{ id: 'control', weight: 1 }, { id: 'b', weight: 1 }],
}

assignVariant(experiment, 'visitor-123').variant.id // stable for that visitor
resolveExperiments([experiment], stableSeed('visitor', '123'))
```

- **Weights** are relative; omitted ⇒ `1` (equal split). Non-positive ⇒ `0`
  (never assigned).
- **Salt** (`experiment.seed`) re-randomizes a fresh run of the same experiment id
  without changing visitor seeds.
- **`projectId`** on a variant maps the experiment to a Weaverse project.

## Previewing variants in Weaverse Studio

Each variant is a separate Weaverse project, so you preview a variant by **opening
its project in Weaverse Studio** — just like editing any project. Studio drives the
storefront preview with that project pinned via the `weaverseProjectId` query param
(priority-1 in the Hydrogen SDK's project resolver).

`getExperiments` handles this automatically: when `weaverseProjectId` is present it
**defers to Studio** — it returns that project as `projectId` (so
`loadPage({ projectId })` loads exactly what you opened) and forces the matching
variant's assignment (so `useExperiment(...)` and analytics `customData` reflect the
previewed variant). No seed cookie is minted during a preview. Without this, the
hashed assignment would override `loadPage` and pin the editor to a single bucket —
you could never reach the other variant from Studio.

## Framework-agnostic usage

`getExperiments` takes a standard `Request` and returns standard `Headers`, so the
exact same call works outside Hydrogen:

```ts
// Cloudflare Worker / Next.js route handler / Remix / Deno / Bun
import { getExperiments } from '@weaverse/experiments/server'

export default {
  fetch(request: Request) {
    let { projectId, setCookie } = getExperiments(request, {
      experiments: [{ id: 't', variants: [{ id: 'a', projectId: 'p1' }, { id: 'b', projectId: 'p2' }] }],
    })
    let res = new Response(`project=${projectId}`)
    if (setCookie) res.headers.append('Set-Cookie', setCookie)
    return res
  },
}
```

## API

### `@weaverse/experiments`

- `assignVariant(experiment, seed): Assignment` — deterministic, weighted pick. Throws on empty variants.
- `resolveExperiments(experiments, seed): Assignment[]` — one assignment per experiment.
- `stableSeed(...parts): string` — join non-empty parts into a seed.
- `hashToBucket(key): number` — FNV-1a hash to `[0, 1)`.

### `@weaverse/experiments/server`

- `getExperiments(request, config): { assignments, seed, projectId?, setCookie?, headers }`
  - `config.experiments` — experiments to resolve.
  - `config.projectIdFrom` — which experiment supplies `projectId` (default: first).
  - `config.seed` — supply a seed to skip cookie handling.
  - `config.cookieName` / `config.maxAge` — seed cookie tuning (default `_wv_vid`, 1 year).

### `@weaverse/experiments/react`

- `<WeaverseExperiments value={assignments} onExpose?={fn}>` — provides assignments, fires exposure once per `(experiment, variant)`.
- `useExperiment(id): Assignment | undefined`
- `useExperiments(): Assignment[]`

## License

MIT
