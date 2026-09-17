let cachedUniversities = null;
let cacheTime = 0;

const DATA_URL = "https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json";
const API_URL = "https://universities.hipolabs.com/search";
const CACHE_TTL = 30 * 60 * 1000;

const normalize = (value = "") => value
  .toString()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, " ")
  .trim();

const matches = (university, name, country) => {
  const q = normalize(name);
  const selectedCountry = normalize(country);
  const searchable = [
    university.name,
    university["state-province"],
    ...(university.web_pages || []),
    ...(university.domains || []),
  ].map(normalize).join(" ");

  const countryMatch = !selectedCountry || normalize(university.country) === selectedCountry;
  if (!countryMatch) return false;
  if (!q) return true;

  // Search is intentionally partial and location-aware. Typing "Pune"
  // can therefore find universities whose state/city is Pune even when
  // "Pune" is not part of the university's official name.
  return searchable.includes(q);
};

async function loadDataset() {
  if (cachedUniversities && Date.now() - cacheTime < CACHE_TTL) return cachedUniversities;
  const response = await fetch(DATA_URL, { signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error(`Dataset returned ${response.status}`);
  const data = await response.json();
  if (!Array.isArray(data)) throw new Error("Dataset is not an array");
  cachedUniversities = data;
  cacheTime = Date.now();
  return data;
}

export default async function handler(req, res) {
  const { name, country } = req.query;
  const universityName = typeof name === "string" ? name.trim() : "";
  const selectedCountry = typeof country === "string" ? country.trim() : "";

  if (!universityName && !selectedCountry) {
    return res.status(400).json({ error: "University name or country is required" });
  }

  try {
    let results = [];

    // Use the hosted API first because it is optimized for normal name/country searches.
    try {
      const params = new URLSearchParams();
      if (universityName) params.set("name", universityName);
      if (selectedCountry) params.set("country", selectedCountry);
      const response = await fetch(`${API_URL}?${params.toString()}`, {
        signal: AbortSignal.timeout(10000),
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) results = data;
      }
    } catch (error) {
      console.warn("Hosted university search unavailable; using local dataset:", error?.message);
    }

    // If "Pune" (or another city/state) is entered, the hosted name search
    // can miss institutions whose official name does not contain that city.
    // Fall back to the maintained Hipo dataset and search name + location.
    if (!results.length || universityName) {
      const dataset = await loadDataset();
      const fallback = dataset.filter((university) => matches(university, universityName, selectedCountry));
      if (universityName) {
        const resultKeys = new Set(results.map((item) => `${item.name}|${item.country}|${item["state-province"] || ""}`));
        for (const item of fallback) {
          const key = `${item.name}|${item.country}|${item["state-province"] || ""}`;
          if (!resultKeys.has(key)) results.push(item);
        }
      } else {
        results = fallback;
      }
    }

    // Put the closest name/location matches first while keeping the result set useful.
    if (universityName) {
      const q = normalize(universityName);
      results.sort((a, b) => {
        const score = (item) => {
          const nameValue = normalize(item.name);
          const locationValue = normalize(item["state-province"]);
          if (nameValue === q) return 0;
          if (nameValue.startsWith(q)) return 1;
          if (nameValue.includes(q)) return 2;
          if (locationValue === q) return 3;
          if (locationValue.includes(q)) return 4;
          return 5;
        };
        return score(a) - score(b) || a.name.localeCompare(b.name);
      });
    }

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    return res.status(200).json(results);
  } catch (error) {
    console.error("University API error:", error);
    return res.status(502).json({ error: "Unable to reach the university data service" });
  }
}
