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
// app/root.tsx
import { WeaverseExperiments } from '@weaverse/experiments/react'

export default function App() {
  let { assignments } = useLoaderData<typeof loader>()
  return (
    <WeaverseExperiments
      value={assignments}
      onExpose={(a) =>
        window.gtag?.('event', 'experiment_view', {
          experiment_id: a.experimentId,
          variant_id: a.variant.id,
        })
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
import { WeaverseExperiments } from '@weaverse/experiments/react'

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
      <ExperimentExposure assignments={assignments} />
      <Outlet />
    </Analytics.Provider>
  )
}

function ExperimentExposure({ assignments }) {
  let { publish, canTrack } = useAnalytics()
  return (
    <WeaverseExperiments
      value={assignments}
      onExpose={(a) => {
        if (!canTrack()) return // respect Customer Privacy consent
        publish('custom_experiment_viewed', {
          experimentId: a.experimentId,
          variantId: a.variant.id,
        })
      }}
    />
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
