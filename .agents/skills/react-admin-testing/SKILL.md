---
name: react-admin-testing
description: Testing guidance for CleanAI React Admin using Vitest, React Testing Library, user-event, MSW, jsdom, and V8 coverage. Use when adding behavior, fixing regressions, choosing unit versus integration coverage, mocking HTTP boundaries, or updating Admin CI test commands.
---

# React Admin Testing

## Choose the Test Level

- Use a unit test for pure formatters, schemas, query builders, reducers, and isolated business presentation rules.
- Use a component test for rendering states, validation, accessibility, and user interaction.
- Use a route integration test when router, providers, query state, forms, and multiple components must cooperate.
- Use MSW for HTTP success and failure contracts. Do not mock fetch, TanStack Query internals, or component implementation details.

## Conventions

- Co-locate tests as `*.test.ts` or `*.test.tsx`; keep shared setup and render helpers in `src/test`.
- Write descriptions in Vietnamese with stable identifiers such as `[UT-WEB-SERVICE-001-01]` and `[IT-WEB-AUTH-001-01]`.
- Prefer role, name, label, and visible text queries. Use test IDs only when no semantic query exists.
- Drive interactions with user-event and assert observable outcomes, not private state or call sequences unless the callback is the component contract.
- Reset MSW handlers and query clients between tests. Do not depend on test order or live services.

## Coverage

Cover applicable loading, success, empty, validation, error, retry, unauthorized, forbidden, conflict, timeout, stale, confirmation, cancellation, and repeated-submission behavior.

For a regression, write the smallest failing test first. Run it directly, then run:

```powershell
npm test
npm run test:coverage
npm run typecheck
npm run build
```
