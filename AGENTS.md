# Repository Guidelines

## Project Structure & Module Organization

This pnpm + Turborepo monorepo centers on `packages/vue-fabric-fiber`, which ships the Fabric.js Vue binding. Library entry points reside in `lib/`, runtime UI in `src/`, shared types in `types/`, and dist output in `dist/`. Tests live in `test/*.test.ts`; keep new workspaces under `packages/` or `apps/` with their own `vitest.config` so the root runner finds them.

## Build, Test, and Development Commands

- `pnpm install` enforces the pnpm workspace setup (`preinstall` blocks npm or yarn).
- `pnpm dev --filter vue-fabric-fiber` starts the Vite dev server; append `-- --open` to launch the browser.
- `pnpm build` triggers `turbo run build`, running vue-tsc checks plus production Vite builds across packages.
- `pnpm test` runs Vitest in batch mode; scope with `pnpm test --filter vue-fabric-fiber` or switch to `pnpm test:dev` for watch mode.
- `pnpm lint` executes shared ESLint and Stylelint tasks; `pnpm --filter vue-fabric-fiber lint:fix` applies autofixes.

## Coding Style & Naming Conventions

The shared `@icebreakers/eslint-config` enforces TypeScript, ES modules, 2-space indentation, and no semicolons. Name Vue components in PascalCase, composables with a `use` prefix, and utility modules in kebab-case. `@icebreakers/stylelint-config` checks CSS; keep styles scoped with components and let lint-staged format staged files before commits.

## Testing Guidelines

Vitest plus jsdom handle tests; colocate specs in `test/` using `.test.ts`. Target meaningful coverage (V8 coverage is enabled) and prefer Vue Test Utils for component logic. Run `pnpm test -- --coverage` before PRs and use `pnpm test:dev` while iterating.

## Commit & Pull Request Guidelines

Follow Conventional Commits (`feat:`, `fix:`, etc.); `pnpm commit` and the commit-msg hook validate the style. Keep messages imperative and scoped, e.g. `feat(canvas): support background loading`. PRs should link issues, list behavioural changes, note test coverage, and attach UI screenshots when applicable; confirm build, lint, and tests pass first.

## Automation & Release Notes

Changesets manage releases—add one via `pnpm changeset` whenever published behaviour shifts. CI expects Node ≥20 and uses Turborepo caching, so keep script names aligned with `turbo.json`. `pnpm script:sync` refreshes scaffolding after adding packages, while `pnpm script:clean` removes template leftovers.
