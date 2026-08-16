Purpose
These instructions help Copilot CLI sessions and AI agents work effectively in this repo (Medusa DTC Starter). Read README.md and AGENTS.md for full docs; CLAUDE.md points to AGENTS.md.

Quick commands (run from repo root)
- Detect package manager (authoritative):
  node -p "require('./package.json').packageManager ?? 'unset'"
  Lockfile order (use the first present): pnpm-lock.yaml → yarn.lock → package-lock.json
- Install: pnpm install
- Dev (all apps): pnpm run dev
- Build (all apps): pnpm run build
- Start: pnpm run start
- Lint (all apps): pnpm run lint
- Test (all test tasks via turbo): pnpm run test

Per-app / single-test examples
- Start backend dev: pnpm run backend:dev
- Start storefront dev (if present): pnpm run storefront:dev
- Run a single backend unit test: cd apps/backend && pnpm run test:unit -- src/modules/foo/__tests__/service.unit.spec.ts
- Match test by name: cd apps/backend && pnpm run test:unit -- -t "returns the cart"

High-level architecture
- Monorepo (Turborepo) workspace. Top-level scripts use turbo to run tasks across packages.
- apps/backend — Medusa backend (Node 20+, PostgreSQL). Uses Medusa modules, services, and workflows. Backend has admin UI code under apps/backend/src/admin and API routes under apps/backend/src/api.
- apps/storefront (optional) — Next.js storefront (App Router). Can be absent; always check apps/storefront/ exists before running storefront commands.
- Shared infra: turbo.json defines task graph; package manager is chosen at install time (see detection above).

Key repository conventions (important, not generic)
- Package manager: Always detect and use the repo's package manager. Do NOT introduce a second lockfile.
- Turborepo: prefer running tasks from the repo root (pnpm run build / lint / test) so turbo uses cached task graph.
- Backend patterns:
  - Business logic belongs in workflows (not directly in route handlers). If mutation code is in a route, prefer implementing as a workflow step and invoking workflow(req.scope).run({ input }).
  - Use medusa CLI helpers (pnpm exec medusa ...) for DB migrations and user creation.
- Frontend patterns (storefront):
  - File-based routing (Next.js App Router). Use pages under src/app/[countryCode]/... and the pre-existing structure for regions/collections.
  - Prefer typed POJOs for server actions; prefer explicit types over any to satisfy project lint rules.
- Coding style enforced: no semicolons, double quotes, 2-space indent, kebab-case filenames, PascalCase types/classes. The backend must satisfy @medusajs/eslint-plugin rules; do not disable plugin rules—fix code to conform.

Safety & off-limits
- Never commit .env or .env.local or reveal secrets. Edit .env.template instead when documenting new env vars.
- Do not edit existing migrations in src/modules/*/migrations — add new migrations instead.
- Do not hand-edit lockfiles. Use the detected package manager to make dependency changes.
- Ignored folders: apps/backend/.medusa/, apps/storefront/.next/, dist/, out/, .turbo/, node_modules/ (build output and caches).

Developer workflows Copilot should follow
- Before making edits: run lint and a targeted build to detect repository-specific lint/type issues
- After changes that affect types/models: generate/run migrations via medusa CLI (cd apps/backend && pnpm exec medusa db:generate <module> and pnpm exec medusa db:migrate)
- For frontend changes: check apps/storefront exists, run a dev build (pnpm run storefront:dev) and run next build when validating PRs
- Use turborepo filters when appropriate (e.g., turbo --filter=@dtc/backend)

Files to consult during sessions
- README.md — setup and env variables
- AGENTS.md — repository conventions, tooling, and off-limits guidance (authoritative for agent behavior)
- CLAUDE.md — pointer to AGENTS.md

If an assistant will run background agents or external tools
- Ensure package manager detection happens first and that commands run with the repo's chosen manager
- Prefer running targeted tasks (lint/build for the affected package) instead of global runs when possible

If this file already exists
- Merge changes rather than replace wholesale. Keep AGENTS.md as the canonical source for architecture and conventions — summarize only the critical parts here.

MCP servers
- If you want, configure MCP servers for Medusa docs or Playwright test runners (useful for storefront E2E). Ask and the repo will be prepared with suggested endpoints.

Summary
This file collects the repo-specific commands, architecture notes, and conventions needed for productive Copilot sessions. If anything important is missing or you want MCP server configuration suggestions, say which service to add (Medusa docs, Playwright, or others).