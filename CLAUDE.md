# Claude Code Setup for Rathi Naturals (Grocery E-Commerce)

## Project Overview

- **Tech Stack:** React 18, Vite, TypeScript
- **Backend & Database:** Supabase (Catalog & Search)
- **Payments:** Cashfree integration
- **Testing:** Playwright (E2E), Jest (Unit)
- **Styling:** Tailwind CSS

## Build & Dev Commands

- **Start Dev Server:** `npm run dev`
- **Build for Production:** `npm run build`
- **Run E2E Tests:** `npm run test:e2e`
- **Run Unit Tests:** `npm run test:unit`

## Code Conventions

- Use functional React components with Hooks.
- Ensure strict TypeScript typing.
- Follow the existing Tailwind utility class patterns.
- Do not break SPA routing; ensure all Playwright locator-based tests pass after modifying UI.

## Environment Variables

- Required integrations (Supabase & Cashfree) rely on `.env` variables. Ensure they are loaded properly when making changes to API handlers.
