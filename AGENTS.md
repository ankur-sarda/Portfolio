# AGENTS.md

## Project Overview

This repository contains a single-page personal portfolio site for Ankur Sarda. The site presents professional background, featured engineering work, publications, experience, education, and contact information.

The code appears to be exported from Figma Make. The original design is referenced in `README.md`, and the project includes a prebuilt shadcn/ui-style component library under `src/app/components/ui`.

## Tech Stack

- React 18 with TypeScript
- Vite 6
- Tailwind CSS 4 through `@tailwindcss/vite`
- Radix UI and shadcn/ui components
- pnpm workspace metadata, though `README.md` documents `npm` commands

## Important Files

- `src/main.tsx`: React entry point. Imports global styles and renders `App`.
- `src/app/App.tsx`: Main portfolio page. It renders layout and maps over parsed content data.
- `src/content/portfolio.ts`: Imports and parses the root-level markdown content files.
- `content/`: Editable portfolio content files for intro, projects, publications, experience, education, and contact details.
- `src/styles/index.css`: Global stylesheet entry point.
- `src/styles/tailwind.css`: Tailwind import and source configuration.
- `src/styles/theme.css`: Theme tokens and base typography rules.
- `src/app/components/ui/`: Checked-in UI primitives based on shadcn/ui and Radix.
- `src/app/components/figma/ImageWithFallback.tsx`: Figma-generated image helper.
- `src/imports/ankur_2026.pdf`: Imported resume or supporting PDF asset.
- `guidelines/Guidelines.md`: Placeholder for AI/design guidelines from the Figma Make export.
- `ATTRIBUTIONS.md`: Third-party attribution notes.

## Running The Project

Install dependencies:

```bash
npm i
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

There is no test script currently defined in `package.json`.

## Implementation Notes

- The site is currently implemented as a single long-scrolling page with sections: `intro`, `projects`, `publications`, `experience`, and `contact`.
- Portfolio copy and structured data live in `content/*.md`. Update those files for normal content changes instead of editing JSX.
- Sidebar navigation in `App.tsx` tracks the active section using a scroll listener and calls `scrollIntoView` for smooth navigation.
- Styling is primarily Tailwind utility classes embedded in JSX.
- Keep the Vite plugins in `vite.config.ts`; the comment notes that both React and Tailwind plugins are required for Figma Make.
- The custom `figma:asset/` resolver maps Figma asset imports to `src/assets`.
- The component library under `src/app/components/ui` is broad, but many components are unused by the current portfolio page. Avoid large refactors there unless a task specifically requires it.

## Design And Content Conventions

- Preserve the minimalist portfolio style: white background, gray typography, spacious sections, and restrained accents.
- Keep content edits factual and aligned with the existing resume-like positioning around AI applications, ML infrastructure, data systems, graph learning, and streaming infrastructure.
- Prefer content changes in `content/*.md`; use `src/app/App.tsx` for layout or rendering changes.
- If adding reusable UI, follow the existing shadcn/Radix patterns already checked into `src/app/components/ui`.
- If adding new assets, place application assets under `src/assets` when they are intended to be resolved by the Figma asset resolver.

## Agent Guidance

- Before making changes, inspect the relevant file because this repo is compact and most behavior is in `App.tsx`.
- Use `rg` or `rg --files` for navigation.
- Do not assume this directory is a git repository; it currently has no `.git` metadata.
- Keep generated files and dependency folders out of the repo unless explicitly requested.
- After UI changes, run `npm run build` at minimum. If the change affects layout or interactions, also run the dev server and verify the page in a browser.
