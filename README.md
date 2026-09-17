# UniSearch 🎓

UniSearch is a practical university discovery and application-tracking workspace.

## What it does

### 🔎 University discovery
- Search by university name
- Filter by country with a dropdown
- Browse a country without entering a university name
- Refine, sort, and paginate results
- Open the official university website directly

### 📅 Application tracker
- Add universities directly from search results
- Track application status
- Set an application deadline
- See days remaining or overdue status
- Keep private notes for requirements and portal details
- Work through an application checklist
- See progress across all applications from one dashboard

## Product flow

**Discover → Plan → Prepare → Submit**

The project is intentionally focused on the real work students need to do after finding a university, rather than maintaining a generic favorites or comparison list.

## Inspiration

The application workflow takes inspiration from open-source student projects such as Abroad Compass, which combines university planning with application status, document tracking, deadlines, and roadmap-style preparation, and Study Overseas Map, which uses a step-by-step roadmap and progress tracking. UniSearch keeps the scope smaller and works without requiring an account or database.

## Data source

University discovery uses the Hipo University Domains and Names API. The API supports searching by university name and/or country and returns university names, countries, domains, and official website URLs.

Important admission information such as tuition, deadlines, requirements, rankings, and acceptance rates is **not invented by UniSearch**. Users should verify those details on each university's official website before applying.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Tech stack

- React + Vite
- React Router
- Tailwind CSS + daisyUI
- Axios
- LocalStorage for application tracking
- Serverless API proxy for university search
