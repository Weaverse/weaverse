# Work Logs

## 2026-09-10 — @hta218

- Opened the SDK half with `ThemeRoutes` and a `resolveThemeRoute` helper (now #519).

## 2026-10-07 — @hta218

- Settled the open questions (see README).
- Rebased onto `main`.
- Moved resolution to the Builder, its only consumer, and kept the SDK to types plus the `:handle` / `:blog` param contract. The earlier tests used `:article` and `:handle` for the same value; the contract now names one.
