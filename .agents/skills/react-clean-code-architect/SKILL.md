---
name: react-clean-code-architect
description: Architecture-aware guidance for implementing, refactoring, or reviewing the CleanAI React Admin application. Use for React and TypeScript component boundaries, feature placement, Material UI theming, TanStack Query state, React Hook Form and Zod forms, error handling, accessibility, and verification decisions.
---

# React Clean Code Architect

## Workflow

1. Inspect `AGENTS.md`, nearby source, tests, package scripts, and existing feature conventions.
2. Identify the narrowest change that satisfies the requested Admin behavior.
3. Put composition and routes in `src/app`, reusable UI in `src/components`, domain code in `src/features`, infrastructure in `src/lib`, and design constants in `src/theme`.
4. Add or update observable tests with `$react-admin-testing`.
5. Run targeted checks, then lint, type-check, tests, and build.

## Architecture

- Keep strict TypeScript types at component props, API boundaries, form schemas, and shared callbacks. Avoid `any` and unsafe casts.
- Keep files focused and normally below 300 lines. Split by actual UI, state, or domain responsibility.
- Prefer composition and focused hooks over base components, inheritance, generic factories, or speculative abstractions.
- Use Material UI components and shared theme tokens instead of local color literals or duplicated styling systems.
- Keep remote state in TanStack Query, form state in React Hook Form, and URL-visible filters in the router/search parameters.
- Validate forms with Zod while treating backend authorization and business validation as authoritative.
- Handle structured validation, unauthorized, forbidden, conflict, timeout, and unexpected errors without exposing sensitive data.

## Quality

- Build accessible semantic headings, labels, focus order, keyboard actions, and responsive behavior.
- Show loading, success, empty, error, retry, permission, and conflict states when relevant.
- Avoid unrelated refactors, generated abstractions, and dependencies that are not required by the task.
- Preserve public contracts unless the requested behavior requires a coordinated change.

## Verification

Run the smallest relevant test first, then:

```powershell
npm run lint
npm run typecheck
npm run format:check
npm run test:coverage
npm run build
```
