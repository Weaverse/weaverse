# Feature: Theme element selection contract

| Field            | Value                                                                    |
| ---------------- | ------------------------------------------------------------------------ |
| **Status**       | completed                                                                |
| **Owner**        | @leehoang                                                                |
| **Issue**        | [Weaverse/builder#2673](https://github.com/Weaverse/builder/issues/2673) |
| **Branch**       | `feat/header-footer-popup-outline`                                       |
| **Created**      | 2026-07-27                                                               |
| **Last Updated** | 2026-07-27                                                               |

## Original Prompt

> Implement the SDK contract required for Header, Footer, Announcement, and Popup theme settings to behave like selectable Studio elements: give each Outline-enabled settings group a stable identity, mark its real storefront DOM, and allow conditional elements to reveal themselves before Studio highlights them.

## Summary

Add stable `outlineId` identity to Outline-enabled inspector groups and expose a Hydrogen theme-element helper for DOM markers and reveal callbacks. The contract does not create page item instances or change theme-settings persistence.
