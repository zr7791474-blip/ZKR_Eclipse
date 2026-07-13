# ZKR Eclipse

ZKR Eclipse is a premium SaaS dashboard built with React, TypeScript, and Vite. It ships with a token-based design system, a collapsible sidebar, a data-rich dashboard home, projects/workspace/users/orders/products pages, and a reusable component library (buttons, cards, modals, dropdowns, toasts, tables, and charts).

## Getting started

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` — start the local dev server
- `npm run build` — type-check and build for production
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint

## Design system

Colors, spacing, radii, shadows, and motion tokens live in `src/styles/tokens.css`. Component styles consume these tokens via CSS variables, so theme changes (light/dark, brand color) cascade automatically across the app.

## Project structure

```
src/
  components/   reusable UI, layout, chart, table, and modal components
  context/      React context providers (theme, toasts, projects)
  data/         mock data for local development
  hooks/        shared hooks
  pages/        route-level pages
  router/       route definitions
  store/        app-level state
  styles/       global styles and design tokens
```
