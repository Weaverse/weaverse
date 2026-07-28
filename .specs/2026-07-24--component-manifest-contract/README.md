# Feature: Versioned Component Manifest Contract and Generator

| Field | Value |
| --- | --- |
| **Status** | completed |
| **Owner** | @paul |
| **Issue** | [#505](https://github.com/Weaverse/weaverse/issues/505) |
| **Branch** | `feat/agent-component-manifest` |
| **Created** | 2026-07-24 |
| **Last Updated** | 2026-07-24 |

## Original Prompt

> let start

## Requirement

Implement [Weaverse/weaverse#505](https://github.com/Weaverse/weaverse/issues/505), the first dependency of the agent-ready composition RFC in [#493](https://github.com/Weaverse/weaverse/issues/493).

## Summary

Define a versioned, deterministic JSON component-manifest contract and a generic SDK generator over registered component modules. The manifest exposes non-sensitive component contracts, marks dynamic rules without serializing function source, detects invalid or duplicate schemas, and produces canonical bytes and a SHA-256 hash suitable for binding proposals to a deployed runtime.
