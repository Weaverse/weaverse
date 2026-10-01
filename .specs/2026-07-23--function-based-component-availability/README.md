# Feature: Function-Based Component Availability

| Field            | Value                                                                                                   |
| ---------------- | ------------------------------------------------------------------------------------------------------- |
| **Status**       | in-progress                                                                                             |
| **Owner**        | @paul                                                                                                   |
| **Issue**        | [builder#2736](https://github.com/Weaverse/builder/issues/2736)                                         |
| **Branch**       | `feat/function-based-component-availability`                                                            |
| **Created**      | 2026-07-23                                                                                              |
| **Last Updated** | 2026-07-23                                                                                              |

## Original Prompt

> take a look and prepare a plan to implement https://github.com/Weaverse/builder/issues/2736
>
> also our docs, skills also need to update afterward
>
> /Users/paul/Workspace/shopify-hydrogen-skills
>
> ok let start

## Summary

Add the public schema types for synchronous, context-aware component availability while preserving `enabledOn`. Runtime callback evaluation remains in Builder's preview bridge; this repository supplies the validated SDK contract consumed by storefront themes and Builder.
