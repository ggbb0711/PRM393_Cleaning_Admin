# CleanAI React Admin

React administration foundation for the CleanAI cleaning-services platform.

## Stack

- React, Vite, and strict TypeScript
- Material UI with the shared CleanAI color palette
- React Router, TanStack Query, React Hook Form, and Zod
- Vitest, React Testing Library, user-event, MSW, and V8 coverage

## Requirements

- Node.js 24
- npm

## Start

```powershell
Copy-Item .env.example .env
npm ci
npm run dev
```

This initialization does not call the backend. `VITE_API_BASE_URL` is reserved for future API integration.

## Verify

```powershell
npm run lint
npm run typecheck
npm run format:check
npm run test:coverage
npm run build
```
