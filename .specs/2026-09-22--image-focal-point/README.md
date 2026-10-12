# Feature: Image focal point metadata

| Field | Value |
| --- | --- |
| **Status** | in-progress |
| **Owner** | @hta218 |
| **Issue** | [Weaverse/weaverse#528](https://github.com/Weaverse/weaverse/issues/528) |
| **Discussion** | [#523](https://github.com/orgs/Weaverse/discussions/523) |
| **Branch** | `feat/image-focal-point` |
| **Base** | `main` |
| **Created** | 2026-09-22 |
| **Last Updated** | 2026-09-22 |

## Initiating Requirement

Add optional `focalPoint?: { x: number; y: number }` metadata to the canonical
`WeaverseImage` contract and expose it through the existing public SDK exports.
Coordinates must be finite numbers in `[0, 1]`, measured from the original
image's top-left corner; `{ x: 0.8, y: 0.3 }` identifies the point 80% across
and 30% down the image. The value belongs to each input/usage, not globally to a
Shopify file. When absent, themes retain their existing positioning behavior.

Trace image serialization, validation, and Studio-to-theme data paths, preserving
the field wherever those paths handle image values. Validate it at applicable
existing boundaries without breaking legacy image values. Document the coordinate
convention, per-usage ownership, optional fallback, and theme integration
requirement. Consumers must be able to type images with or without the field,
receive the point in theme component props, and reject malformed or out-of-range
values wherever validation handles the field. Publish the affected packages so
Studio and themes can consume the contract.

Studio owns the editor in [Weaverse/builder#3043](https://github.com/Weaverse/builder/issues/3043);
Pilot supplies rendering examples in [Weaverse/pilot#176](https://github.com/Weaverse/pilot/issues/176).
An SDK upgrade alone does not reposition arbitrary theme images. Crop rectangles,
image transformation services, global Shopify file mutations, and breakpoint-specific
focal point fields are outside this iteration.

## Scope Updates

### 2026-09-22 — Implementation and review delivery

Implement the SDK issue, verify it, split changes into focused commits, push the
feature branch, and open a PR against `main`. Package publication remains a
post-merge release step; this change does not merge or publish packages.

## Summary

The SDK carries per-usage image focal points through its existing data stores and
rendering flow. Schema authoring validates focal points on image defaults; Studio
remains responsible for validating persisted editor values, and themes opt into
rendering the point.
