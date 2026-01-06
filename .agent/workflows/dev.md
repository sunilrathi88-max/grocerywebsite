---
description: Auto-run development commands without manual confirmation
---

# Development Workflow (Turbo Mode)

// turbo-all

This workflow enables auto-confirmation for all development commands.

## Common Commands

1. Start development server

```bash
npm run dev
```

2. Run TypeScript type check

```bash
npx tsc --noEmit
```

3. Run linting

```bash
npm run lint
```

4. Run tests

```bash
npm test
```

5. Build for production

```bash
npm run build
```

6. Run Cypress tests

```bash
npx cypress run
```

## Notes

- All commands above will auto-run when this workflow is referenced
- Use `/dev` to activate this workflow
