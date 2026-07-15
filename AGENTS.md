# Repository Agent Guidance

## Repository Shape

- This repository contains the CleanAI React Admin web application.
- Keep application composition and routing in `src/app`, reusable UI in `src/components`, business modules in `src/features`, shared infrastructure in `src/lib`, design tokens in `src/theme`, and test infrastructure in `src/test`.
- Use React, Vite, strict TypeScript, Material UI, React Router, TanStack Query, React Hook Form, and Zod.
- Reusable Codex skills live in `.agents/skills`.

## Default Workflow

- Inspect nearby components, tests, and feature conventions before editing.
- Use `$react-clean-code-architect` for architecture, component boundaries, TypeScript, and verification decisions.
- Use `$react-admin-table-workflows` for dashboards, collections, detail, edit, delete, filtering, pagination, and destructive actions.
- Use `$react-admin-testing` whenever behavior or tests change.
- Implement only the requested Admin capability; do not invent unavailable backend endpoints.
- Keep components focused and normally below 300 lines. Extract behavior by feature or reusable UI responsibility, not speculative abstractions.

## Admin UI Rules

- Match CleanAI branding: primary `#2563EB`, secondary `#10B981`, warning `#F59E0B`, error `#BA1A1A`, Inter typography, and the shared light/dark surface palette.
- Use dashboard summaries for aggregate metrics and operational status.
- Use tables for collections and record management. Do not replace manageable tabular data with unrelated card grids.
- Put search, filters, sorting, pagination, column controls, and the primary create action in the table toolbar.
- Open View from a table row into a detail drawer or dedicated detail page while preserving table filters and pagination.
- Open Edit from the row action menu into a validated drawer, dialog, or dedicated form page. Show field-level validation and protect unsaved work.
- Delete, archive, suspend, refund, financial, privacy-sensitive, or otherwise destructive actions must identify the target, summarize consequences, require explicit confirmation, and collect a reason when the domain requires one.
- Prefer domain actions such as archive, suspend, approve, cancel, or refund over arbitrary record mutation.
- Every data surface must handle loading, success, empty, error, retry, disabled, permission-denied, and stale/conflict states where applicable.
- Keep unavailable actions hidden or disabled with an explanation, while treating backend authorization and state validation as authoritative.
- Use accessible labels, keyboard navigation, semantic headings, and responsive layouts from the start.

## Data and Security

- Read the API base URL from `VITE_API_BASE_URL`; never hard-code deployment URLs.
- Keep server state in TanStack Query and form state in React Hook Form. Do not mirror server responses into unrelated global state.
- Validate forms with Zod for usability, but repeat every permission and business validation on the backend.
- Never log or render passwords, refresh tokens, OTPs, payment secrets, or protected fields.
- Preserve structured API errors and handle `401`, `403`, `409`, validation failures, timeouts, and unexpected failures explicitly.

## Testing and Verification

- Write test descriptions in Vietnamese and prefix them with IDs such as `[UT-WEB-USER-001-01]` or `[IT-WEB-WORKER-001-01]`.
- Prefer observable behavior over component implementation details.
- Use Vitest for logic, React Testing Library for components and routes, user-event for interaction, and MSW for HTTP boundaries.
- Run the smallest relevant test first, then the complete checks:

```powershell
npm run lint
npm run typecheck
npm run format:check
npm run test:coverage
npm run build
```

## Git

- Do not commit or push unless explicitly requested.
- Preserve unrelated user changes.
- Keep commits focused and report verification results and known gaps.
