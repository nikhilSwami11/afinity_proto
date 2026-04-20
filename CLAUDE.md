# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Affinity** is a frontend-only prototype of a thought-based social network. Users publish thoughts instead of profiles; the system maps them into a semantic space and surfaces "nearby minds" with similar philosophies. All data is currently mocked.

The Next.js app lives in `frontend/`. The repo root contains only this file, a README, and git config.

## Commands

All commands run from `frontend/`:

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run lint     # Run ESLint
```

## Architecture

### Routing

This app uses **custom state-based routing**, not Next.js file-based routing. `src/app/page.tsx` renders a single `<PrototypeApp />` component that manages all navigation via `useState`.

Screen flow: `landing` → `onboarding` → `placement` → `app`

Within the `app` screen, `AppShell` renders tab pages: `home`, `write`, `discover`, `map`, `profile`, `settings`.

### State Management

No external state library. `prototype-app.tsx` is the root state container holding:
- `screen` — which top-level screen is shown
- `appPage` — which tab is active in the app shell
- `answers` — onboarding questionnaire responses

Child components receive navigation callbacks as props to trigger screen transitions.

### Key Files

| File | Purpose |
|------|---------|
| `src/components/affinity/prototype-app.tsx` | Root state container and screen router |
| `src/components/affinity/app-shell.tsx` | Three-column layout with sidebar nav and page rendering |
| `src/components/affinity/data.ts` | All mock data (prompts, users, thoughts) |
| `src/components/ui/` | shadcn/ui primitives (Button, Card, Badge, etc.) |
| `src/app/globals.css` | Tailwind v4 imports + OKLCH color theme tokens |

### Styling Conventions

- Tailwind CSS v4 with OKLCH-based custom color tokens
- Dark theme throughout (slate-950/900 backgrounds)
- Glass-morphism: `bg-white/5 backdrop-blur border-white/10`
- Violet/teal accent colors for highlights
- Animations via Motion (Framer Motion): `AnimatePresence` + `motion.*` components

### Path Aliases

`@/*` maps to `src/*` (configured in `tsconfig.json`).

## gstack

Use the `/browse` skill from gstack for all web browsing. Never use `mcp__claude-in-chrome__*` tools.

Available gstack skills:
`/office-hours`, `/plan-ceo-review`, `/plan-eng-review`, `/plan-design-review`, `/design-consultation`, `/design-shotgun`, `/design-html`, `/review`, `/ship`, `/land-and-deploy`, `/canary`, `/benchmark`, `/browse`, `/connect-chrome`, `/qa`, `/qa-only`, `/design-review`, `/setup-browser-cookies`, `/setup-deploy`, `/retro`, `/investigate`, `/document-release`, `/codex`, `/cso`, `/autoplan`, `/plan-devex-review`, `/devex-review`, `/careful`, `/freeze`, `/guard`, `/unfreeze`, `/gstack-upgrade`, `/learn`

## Skill routing

When the user's request matches an available skill, ALWAYS invoke it using the Skill
tool as your FIRST action. Do NOT answer directly, do NOT use other tools first.
The skill has specialized workflows that produce better results than ad-hoc answers.

Key routing rules:
- Product ideas, "is this worth building", brainstorming → invoke office-hours
- Bugs, errors, "why is this broken", 500 errors → invoke investigate
- Ship, deploy, push, create PR → invoke ship
- QA, test the site, find bugs → invoke qa
- Code review, check my diff → invoke review
- Update docs after shipping → invoke document-release
- Weekly retro → invoke retro
- Design system, brand → invoke design-consultation
- Visual audit, design polish → invoke design-review
- Architecture review → invoke plan-eng-review
- Save progress, checkpoint, resume → invoke checkpoint
- Code quality, health check → invoke health
