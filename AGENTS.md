# AGENTS.md — University Project

> Auto-generated project manifest. Update on every change with timestamped log entries. Never rewrite entire file — only append/update what changed.

---

## Project Overview

| Field | Value |
|---|---|
| **Name** | `university` |
| **Version** | `0.0.0` |
| **Type** | Vite 8 + React 19 + Tailwind v4 + daisyUI |
| **Private** | `true` |
| **Entry** | `index.html` -> `src/main.jsx` -> `src/App.jsx` |

**Description:** A university search app. Fetches university data from `http://universities.hipolabs.com/search?country={country}` via axios and displays results in a daisyUI table.

---

## File Tree

```
University/
├── .git/
├── .gitignore
├── AGENTS.md                          (this file)
├── agent/
│   ├── agency-agents/                 (git submodule)
│   └── impeccable/                    (git submodule)
├── api/
│   └── universities.js                (Vercel serverless proxy)
├── dist/
│   ├── assets/
│   │   ├── index-BgLTeIvj.css
│   │   └── index-VO-yTrcE.js
│   ├── favicon.svg
│   ├── icons.svg
│   └── index.html
├── node_modules/                      (exists, ~1857 files)
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── App.css                        (empty)
│   ├── App.jsx
│   ├── Favorites.jsx
│   ├── FavoritesContext.jsx
│   ├── Home.jsx
│   ├── index.css
│   ├── main.jsx
│   ├── Navbar.jsx
│   ├── PageViews.jsx
│   ├── Search.jsx
│   └── VisitorCounter.jsx
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── vite.config.js
```

---

## Dependencies

### Runtime Dependencies

| Package | Version | Purpose |
|---|---|---|
| `@tailwindcss/vite` | `^4.2.2` | Tailwind CSS Vite plugin |
| `axios` | `^1.14.0` | HTTP client for API calls |
| `react` | `^19.2.4` | UI library |
| `react-dom` | `^19.2.4` | React DOM renderer |
| `react-router-dom` | `^7.6.2` | Client-side routing |
| `tailwindcss` | `^4.2.2` | CSS utility framework |

### Dev Dependencies

| Package | Version | Purpose |
|---|---|---|
| `@eslint/js` | `^9.39.4` | ESLint JS config |
| `@types/react` | `^19.2.14` | React type definitions |
| `@types/react-dom` | `^19.2.3` | React DOM type definitions |
| `@vitejs/plugin-react` | `^6.0.1` | Vite React plugin |
| `daisyui` | `^5.5.19` | Tailwind CSS component library |
| `eslint` | `^9.39.4` | Linter |
| `eslint-plugin-react-hooks` | `^7.0.1` | React Hooks lint rules |
| `eslint-plugin-react-refresh` | `^0.5.2` | React Refresh lint rules |
| `gh-pages` | `^6.3.0` | Deploy to GitHub Pages |
| `globals` | `^17.4.0` | Global variables for ESLint |
| `vite` | `^8.0.1` | Build tool & dev server |

---

## Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `vite` | Start Vite dev server |
| `build` | `vite build` | Production build |
| `lint` | `eslint .` | Lint all files |
| `preview` | `vite preview` | Preview production build |
| `deploy` | `gh-pages -d dist` | Deploy `dist/` to GitHub Pages |

---

## Components

### `src/main.jsx`
- **Type:** Entry point (side-effect module)
- **Exports:** None
- **Description:** Creates React root, renders `<App />` inside `<StrictMode>`

### `src/main.jsx`
- **Type:** Entry point (side-effect module)
- **Exports:** None
- **Description:** Creates React root, renders `<App />` inside `<StrictMode>`

### `src/App.jsx`
- **Type:** Root component (routing shell)
- **Exports:** `App` (default)
- **State:** `theme` ("light"|"dark") — persisted to localStorage key `"uni-theme"`
- **Renders:** `FavoritesProvider` > `BrowserRouter` > `Navbar` + `<Routes>` (Home at `/`, Search at `/search`, Favorites at `/favorites`)
- **Key logic:** `useEffect` sets `data-theme` on `<html>` and persists theme to localStorage

### `src/FavoritesContext.jsx`
- **Type:** React Context module
- **Exports:** `FavoritesProvider` (named), `useFavorites` (named), `favKey` (named)
- **Description:** Global favorites state shared across pages. Provides `favorites` (object[]), `toggleFav(params)`, `isFavorite(params)`, `favKey(params)`. Each favorite object: `{id, name, country, "state-province", web_pages, domains}`. Auto-syncs to `localStorage` key `"uni-favorites"`. Handles migration of old `string[]` format.

### `src/Navbar.jsx`
- **Type:** Navigation component
- **Exports:** `Navbar` (default)
- **Props:** `theme`, `setTheme`
- **Description:** Responsive daisyUI navbar with sticky top positioning. Desktop: horizontal menu links (Home, Search, Favorites with count badge). Mobile: hamburger dropdown menu. End slot: theme toggle button (🌙/☀️). Active link highlighting via `NavLink` from react-router-dom. Connected to `FavoritesContext` for favorites count.

### `src/Favorites.jsx`
- **Type:** Favorites page component
- **Exports:** `Favorites` (default)
- **State:** None (reads `favorites`, `toggleFav` from context)
- **Derived data:** `grouped` (useMemo — groups favorites by `country`, sorts countries alphabetically and items by name)
- **Description:** Standalone page at `/favorites` showing all favorited universities grouped by country. Each country is a daisyUI collapse section (expandable, starts open) with a table showing Name, State/Province, Website (clickable link), and a gold heart button to remove from favorites. Empty state shows a prompt with a link to `/search`.
- **Notes:** Uses `useFavorites()` hook from context; fade-in page transition via CSS `@keyframes fadeIn`

### `src/Home.jsx`
- **Type:** Landing page component
- **Exports:** `Home` (default)
- **Description:** Four-section landing page with fade-in animation. Hero section: gradient background, headline "Discover Universities Worldwide", CTA button to `/search`. Features section: 3 cards (Global Database, Smart Search, Save Favorites) with hover scale effect. Statistics section: 3 static stats (15,000+ Universities, 200+ Countries, 10,000+ Daily Users). Footer with copyright.

### `src/VisitorCounter.jsx`
- **Type:** Reusable analytics component
- **Exports:** `VisitorCounter` (default)
- **Props:** `namespace` (string, default `"university-app"`), `className` (string, default `""`)
- **Description:** Displays three stats using daisyUI `stats` — total visitors (via CountAPI), daily active users (localStorage), and online now. Resets daily count on date change. Namespace prop allows multiple independent instances.

### `src/PageViews.jsx`
- **Type:** Privacy-first page view tracker
- **Exports:** `PageViews` (default)
- **Props:** `storageKey` (string, default `"uni-pageviews"`), `className` (string, default `""`), `showHeading` (bool, default `true`)
- **Description:** Tracks per-route page views and daily totals in localStorage using `useLocation`. Displays all-time views, today's views, and top page route with count. Resets on new days automatically.

### `src/Search.jsx`
- **Type:** Search page component
- **Exports:** `Search` (default) — internally named `App` function
- **State:** `country` (string), `uni` (array), `loading` (bool), `error` (string|null), `searched` (bool), `sortKey` (string|null), `sortDir` ("asc"|"desc"), `page` (number), `copiedIdx` (number|null), `viewMode` ("table"|"card"), `activeTab` ("all"|"fav"), `animatingIdx` (number|null), `nameFilter` (string), `filterInput` (string), `selectedRows` (Set)
- **Derived data:** `filteredData` (useMemo — from `uni` on "all" tab, from `favorites` array on "fav" tab, then name-filtered), `displayData` (useMemo — sorted copy of `filteredData`), `totalPages` (number), `paged` (sliced for current page), `favCount` (number — `favorites.length`), `allSelected` (bool — whether all paged rows are selected)
- **Key logic:** `uniApi()` fetches from `http://universities.hipolabs.com/search?country={country}` via axios; `handleKeyDown()` triggers search on Enter; `handleSort()` toggles sort key/direction; `copyDomain()` copies hostname to clipboard; `toggleFav()` wraps context toggleFav with heart animation; `exportCSV(mode)` generates CSV blob from all or selected rows; `handleFilterChange()` debounced (300ms) name filter; `toggleSelectAll()` selects/deselects all paged rows; `toggleRow()` toggles individual row selection
- **UI:** Table/Cards toggle; country text input + Search button; error/empty alerts; tab bar (All/Favorites); filter input (join with clear button) + Export CSV dropdown (All/Selected) + selected count badge; sortable column headers (▲▼); select-all checkbox in table header; per-row checkbox + favorite heart + copy domain; paginated table (10/page) or responsive card grid (3 cols); pagination join
- **Notes:** Uses `useFavorites()` hook from context; `favKey` imported from context; heart animation handled locally; fade-in page transition via CSS `@keyframes fadeIn`

### `src/index.css`
- **Content:** `@import "tailwindcss"` + `@plugin "daisyui"` with light/dark themes; `@theme {}` with 5 custom colors (indigo-velvet #3d348b, medium-slate-blue #7678ed, amber-flame #f7b801, tiger-orange #f18701, cayenne-red #f35b04); `:root` CSS variables for same palette; `@keyframes fadeIn` and `@keyframes heart-pop` animations; `html` transition for theme swap

### `src/App.css`
- **Content:** Empty file

---

## Config Files

| File | Purpose |
|---|---|
| `vite.config.js` | Vite config: React plugin, Tailwind plugin, `@` path alias to `./src` |
| `eslint.config.js` | ESLint flat config: JS recommended, react-hooks, react-refresh, browser globals |
| `index.html` | HTML entry: `<div id="root">`, module script to `src/main.jsx` |
| `.gitignore` | Ignores logs, node_modules, dist-ssr, editor dirs |

---

## Git Status

- **Branch:** `main` (up to date with `origin/main`)
- **Commits:** 4 (all with message "king")
- **Uncommitted changes (modified):**
  - `AGENTS.md` — updated file tree, components, changelog
  - `src/App.jsx` — added PageViews analytics bar to layout
  - `src/Home.jsx` — added VisitorCounter display section
  - `src/Search.jsx` — changed API endpoint to `/api/universities`
  - `vite.config.js` — added dev proxy for `/api`
- **Untracked:** `agent/` directory (2 git submodules), `api/` (Vercel serverless function), `src/Favorites.jsx` (new Favorites page), `src/PageViews.jsx`, `src/VisitorCounter.jsx`

---

## Change Log

<!-- Append new entries here. Format: -->
<!-- ### YYYY-MM-DD HH:MM — Short Description -->
<!-- - File: `path/to/file` — what changed, why -->

### 2026-05-11 — Fixed HTTP mixed-content error via Vercel serverless proxy

- **File:** `api/universities.js` — new Vercel serverless function; proxies requests to `http://universities.hipolabs.com` over HTTPS, eliminating mixed-content errors on Vercel deployments
- **File:** `src/Search.jsx` — changed API endpoint from `http://universities.hipolabs.com/search` to `/api/universities` (same-origin proxy)
- **File:** `vite.config.js` — added `server.proxy` config for `/api` to forward requests to local serverless dev server

### 2026-05-11 — Added VisitorCounter and PageViews analytics components

- **File:** `src/VisitorCounter.jsx` — new reusable component; tracks total visitors via CountAPI, daily active users via localStorage, online now count; accepts `namespace` and `className` props
- **File:** `src/PageViews.jsx` — new privacy-first analytics component; tracks per-route page views and daily totals in localStorage; displays top page, all-time and today counts
- **File:** `src/Home.jsx` — added `<VisitorCounter />` display section between features and stats
- **File:** `src/App.jsx` — added `<PageViews />` analytics bar to page layout (inside BrowserRouter); imported PageViews component

### 2026-05-11 14:00 — Multi-page architecture with React Router

- **File:** `src/App.jsx` — replaced monolithic component with routing shell; added `BrowserRouter`, `FavoritesProvider`, theme localStorage persistence; routes Home at `/` and Search at `/search`
- **File:** `src/FavoritesContext.jsx` — created global favorites context with `FavoritesProvider`, `useFavorites` hook, `favKey` helper; auto-syncs to localStorage; handles `string[]` migration
- **File:** `src/Navbar.jsx` — created responsive daisyUI navbar with sticky top, responsive menu (desktop horizontal, mobile hamburger), active link highlighting via `NavLink`, theme toggle
- **File:** `src/Home.jsx` — created landing page with hero section (gradient background, CTA), feature cards (hover scale), statistics section, footer
- **File:** `src/Search.jsx` — ported all search/table/filter/sort/paginate/export logic from old App.jsx; uses `useFavorites` context; local `toggleFav` wrapper for heart animation; fade-in page transition
- **File:** `src/index.css` — added `@keyframes fadeIn`, `dark` theme via daisyUI `prefersdark`, moved CSS animations here
- **File:** `package.json` — added `react-router-dom` to dependencies

### 2026-05-11 — Initial AGENTS.md creation

- **File:** `AGENTS.md` — created project manifest with full scan (files, deps, scripts, components, configs, git status, change log)

### 2026-05-11 12:09 — Added loading/error/keyboard/empty states + fixed bug

- **File:** `src/App.jsx` — added `loading`, `error`, `searched` state flags; wrapped API call in try/catch with error alert; added `handleKeyDown` for Enter key search; added empty results message; removed dead code (commented-out sort buttons, inline comments); replaced broken `uni < 0` loading guard with proper state-driven rendering
- **File:** `AGENTS.md` — updated App.jsx component section to reflect new state and logic; added this change log entry

### 2026-05-11 12:15 — Added results counter, pagination, sortable columns, copy domain button

- **File:** `src/App.jsx` — added `sortKey`, `sortDir`, `page`, `copiedIdx` state; added `useMemo` for sorted/paged derived data; added `handleSort()` with asc/desc toggle; added `copyDomain()` with navigator.clipboard + 2s "Copied!" timeout; added results counter line; added sortable column headers (▲▼); added paginated table (10/page) with Previous/Next using daisyUI `join`; added Copy button per row (btn-xs btn-ghost); reset sort/page on new search; fixed `web_pages` to use `[0]` + `target="_blank"`; changed outer layout to flex-col
- **File:** `AGENTS.md` — updated App.jsx component section with new state/derived data/logic; added this change log entry

### 2026-05-11 12:45 — Added CSV export, country datalist, multi-country search, comparison modal

- **File:** `src/App.jsx` — replaced single `country` state with `inputCountry` + `countries` array; added `COMMON_COUNTRIES` datalist (30 countries); added `addCountry()`/`removeCountry()` for chip management; refactored `uniApi()` for parallel multi-country fetch with `Promise.all` + dedup by `favKey`; added `exportCSV()` generating Blob from `displayData`; added `compareList` state + `toggleCompare()`; added `<dialog>` comparison modal (daisyUI) with side-by-side table; added compare checkbox per row/card; recent badges now add to chips; updated empty results message
- **File:** `AGENTS.md` — updated App.jsx component section with new state/derived data/logic; added this change log entry

### 2026-05-11 12:35 — Removed features: recent searches, multi-country chips, datalist, compare modal, persistence

- **File:** `src/App.jsx` — restored single `country` state; removed `inputCountry`/`countries`/`recent`/`compareList`/`compareRef` state; removed `addCountry()`/`removeCountry()`/`addRecent()`/`toggleCompare()` functions; simplified `uniApi()` to single-country fetch; restored `handleKeyDown()` to trigger search on Enter; removed datalist, chips UI, recent badges, compare checkboxes, Compare button, comparison modal dialog; removed theme/view localStorage persistence; kept favorites with localStorage, Export CSV, pagination, sorting, copy domain, heart animation, theme toggle (no persistence), view toggle (no persistence)
- **File:** `AGENTS.md` — updated App.jsx component section; added this change log entry

### 2026-05-11 13:00 — Added name filter (debounced), row selection, select-all, export dropdown

- **File:** `src/App.jsx` — added `nameFilter`, `filterInput`, `selectedRows` state; added `handleFilterChange()` with 300ms debounce via useRef timer; added `toggleSelectAll()` and `toggleRow()` for checkbox selection; refactored `exportCSV(mode)` to accept "all" or "selected" mode; added filter input (join with clear button), Export CSV dropdown (All/Selected), selected count badge; added select-all checkbox in table header; added per-row selection checkbox in table and card views; refactored useMemo pipeline into `filteredData` (tab + name filter) then `displayData` (sorted); reset filter/selection on new search and tab switch; added filter context line ("Filtered to X of Y results")
- **File:** `AGENTS.md` — updated App.jsx component section with new state/derived data/logic; added this change log entry

### 2026-05-11 12:45 — Added CSV export, country datalist, multi-country search, comparison modal

- **File:** `src/App.jsx` — replaced single `country` state with `inputCountry` + `countries` array; added `COMMON_COUNTRIES` datalist (30 countries); added `addCountry()`/`removeCountry()` for chip management; refactored `uniApi()` for parallel multi-country fetch with `Promise.all` + dedup by `favKey`; added `exportCSV()` generating Blob from `displayData`; added `compareList` state + `toggleCompare()`; added `<dialog>` comparison modal (daisyUI) with side-by-side table; added compare checkbox per row/card; recent badges now add to chips; updated empty results message
- **File:** `AGENTS.md` — updated App.jsx component section with new state/derived data/logic; added this change log entry

### 2026-05-11 12:35 — Removed features: recent searches, multi-country chips, datalist, compare modal, persistence

- **File:** `src/App.jsx` — restored single `country` state; removed `inputCountry`/`countries`/`recent`/`compareList`/`compareRef` state; removed `addCountry()`/`removeCountry()`/`addRecent()`/`toggleCompare()` functions; simplified `uniApi()` to single-country fetch; restored `handleKeyDown()` to trigger search on Enter; removed datalist, chips UI, recent badges, compare checkboxes, Compare button, comparison modal dialog; removed theme/view localStorage persistence; kept favorites with localStorage, Export CSV, pagination, sorting, copy domain, heart animation, theme toggle (no persistence), view toggle (no persistence)
- **File:** `AGENTS.md` — updated App.jsx component section; added this change log entry

### 2026-05-11 13:10 — Fixed favorites persistence across country searches

- **File:** `src/App.jsx` — changed `favorites` from `string[]` (key-only) to `object[]` storing full university data (`id`, `name`, `country`, `state-province`, `web_pages`, `domains`); changed `filteredData` fav tab to read from `favorites` array directly instead of filtering `uni` (which only holds current search results); changed `favCount` to `favorites.length` (total across all searches); changed `isFav` / `toggleFav` to use object comparisons; added localStorage migration for old string[] format
- **File:** `AGENTS.md` — updated App.jsx component section; added this change log entry

### 2026-05-11 12:30 — Added favorites, recent searches, theme toggle, view toggle, micro-interactions

- **File:** `src/index.css` — added `dark` theme to daisyUI plugin config; added `html` transition for theme swap; added `@keyframes heart-pop` animation for favorite toggle pulse
- **File:** `src/App.jsx` — added `favorites`, `recent`, `theme`, `viewMode`, `activeTab`, `animatingIdx` state; added `favKey()` helper and `load()` localStorage wrapper; `toggleFav()` adds/removes by `name||country` key with heart-pop animation; `addRecent()` stores last 5 unique countries; `useEffect` syncs all preferences to localStorage and sets `data-theme` on `<html>`; added header row with theme toggle (🌙/☀️ btn-outline) and view toggle (Table/Cards join); added recent search badges (badge-soft badge-primary) below input; added tabs-box tab bar (All/Favorites) with counts; added card view (responsive 3-col grid with daisyUI `card` component); reset activeTab to "all" on new search; wrapped displayData in useMemo for combined sort + tab filtering
- **File:** `AGENTS.md` — updated App.jsx component section with new state/derived data/logic; added this change log entry

### 2026-05-11 — Added standalone Favorites page with country-grouped view

- **File:** `src/Favorites.jsx` — created standalone page at `/favorites` showing all favorited universities grouped by country using daisyUI collapse sections; each country section contains a table (Name, State/Province, Website, remove button); empty state with prompt link to `/search`
- **File:** `src/App.jsx` — added `/favorites` route pointing to `<Favorites />`; added import of Favorites component
- **File:** `src/Navbar.jsx` — changed both mobile and desktop Favorites `NavLink` targets from `/search` to `/favorites`
- **File:** `AGENTS.md` — added Favorites.jsx to file tree, added Favorites component section, updated App routes, updated git status

### 2026-05-11 — Replaced Navy/Gold/Slate with 5-color palette (Indigo Velvet, Medium Slate Blue, Amber Flame, Tiger Orange, Cayenne Red)

- **File:** `src/index.css` — replaced `@theme {}` colors (navy, gold, slate) with indigo-velvet, medium-slate-blue, amber-flame, tiger-orange, cayenne-red; added `:root` CSS variables per spec
- **File:** `src/Navbar.jsx` — `bg-navy` → `bg-indigo-velvet`; active nav link → `text-tiger-orange border-tiger-orange`; hover states → `hover:text-amber-flame`; badge → `bg-amber-flame text-indigo-velvet`
- **File:** `src/Search.jsx` — primary buttons → `bg-medium-slate-blue` with `hover:bg-amber-flame`; secondary buttons → `border-amber-flame text-amber-flame` with `hover:bg-tiger-orange`; table header → `bg-indigo-velvet`; sort header hover → `text-tiger-orange`; links → `text-medium-slate-blue hover:text-tiger-orange`; checkboxes → `checked:bg-amber-flame checked:border-amber-flame`; star icons → `text-amber-flame`; pagination → `border-medium-slate-blue/30` with indigo-velvet/amber-flame hover; error alerts use default daisyUI `alert-error` (cayenne-red-themed)
- **File:** `src/Home.jsx** — hero bg → `from-indigo-velvet/10 to-medium-slate-blue/10`; headings → `text-indigo-velvet`; accent spans → `text-amber-flame`; descriptive text → `text-medium-slate-blue`; CTA button → `bg-medium-slate-blue hover:bg-amber-flame`; stats section → `bg-indigo-velvet` with `text-amber-flame` values; footer → `bg-indigo-velvet/95` with `text-amber-flame` brand
- **File:** `src/Favorites.jsx` — headings → `text-indigo-velvet`; empty state CTA → `bg-medium-slate-blue hover:bg-amber-flame`; collapse title → `text-indigo-velvet bg-indigo-velvet/5`; collapse border → `border-medium-slate-blue/20`; links → `text-medium-slate-blue hover:text-tiger-orange`; heart icons → `text-amber-flame`; table cells → `text-medium-slate-blue/70`
