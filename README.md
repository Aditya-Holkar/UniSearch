# UniSearch 🎓

UniSearch is a practical university discovery workspace.

## What it does

### 🔎 University discovery
- Search by university name
- Filter by country with a dropdown
- Browse a country without entering a university name
- Refine, sort, and paginate results
- Open the official university website directly

## Product flow

**Search → Refine → Explore**

UniSearch focuses on making university discovery simple and useful without requiring an account or database.

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
- Serverless API proxy for university search
