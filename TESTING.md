# Admin web testing

## Commands

```powershell
npm test
npm run test:watch
npm run test:coverage
```

`npm test` runs all unit, component, routing, and mocked-API integration tests once. No browser, backend, or database is required.

## Placement

- Co-locate focused tests with the source file using `*.test.ts` or `*.test.tsx`.
- Put shared render helpers, MSW server setup, and environment polyfills in `src/test`.
- Use MSW handlers for HTTP behavior instead of mocking fetch or implementation internals.
- Write descriptions in Vietnamese with `[UT-WEB-...]` or `[IT-WEB-...]` identifiers.

## Required states

Data-driven components must cover loading, success, empty, error, retry, authorization, and conflict behavior when those states apply. Destructive actions must be tested before and after confirmation.
