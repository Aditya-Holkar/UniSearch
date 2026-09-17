# UniSearch 🎓

UniSearch is a focused university discovery and shortlist workspace built with React, Vite, Tailwind CSS and daisyUI.

## What it does

- 🌍 Search universities by country using the Hipolabs Universities API.
- 🔎 Filter, sort, paginate and switch between table/card views.
- 💛 Save universities into a persistent shortlist.
- 📌 Track shortlist status: Researching, Shortlisted, Applying, or Applied.
- 📝 Add private notes to each saved university.
- ⚖️ Compare up to four saved universities side by side.
- 📥 Export search results or selected rows as CSV.
- 🌙 Persist a light/dark theme preference.

## Product flow

**Discover → Shortlist → Compare → Apply**

The project intentionally keeps the decision workflow lightweight. It does not invent tuition, rankings, acceptance rates, deadlines, or other university facts that are not available from the connected data source. Users are encouraged to verify important admissions and cost information on each university's official website.

## Run locally

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Data

University discovery is powered by the [Hipolabs Universities API](https://universities.hipolabs.com/), accessed through the Vercel serverless endpoint in `api/universities.js`.

## Inspiration

The current product direction takes cues from university discovery and study-abroad projects that emphasize advanced filtering, shortlisting, side-by-side comparison, personalized planning, and progress tracking. Examples include Uniscope and Abroad Compass.
