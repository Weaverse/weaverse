# Feature: Media Manager Exclude Config

| Field            | Value                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| **Status**       | in-progress                                                           |
| **Owner**        | @hta218                                                               |
| **Issue**        | [Weaverse/builder#2877](https://github.com/Weaverse/builder/issues/2877) |
| **Branch**       | `feat/media-manager-exclude-config`                                   |
| **Created**      | 2026-08-27                                                            |
| **Last Updated** | 2026-08-27                                                            |

## Original Prompt

> Now we need to do both sides: the Weaverse SDK repo and the Studio repo. Do them one after the other.
> Both projects are available locally, check them, then sync the latest remote (builder is on the `dev` branch, the SDK is on `main`).
> When each side is done, commit in multiple commits, push, and open a PR.

## Summary

Adds developer-declared media filtering to the SDK: a `media` key on
`HydrogenThemeSchema` for store-wide defaults, and matching `configs` on the
`image` and `video` inputs that override the theme value per field. The Studio
side reads these and applies them to the Media Manager gallery query, replacing
the merchant-editable project-level filter.
