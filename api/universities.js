export default async function handler(req, res) {
  const { name, country } = req.query;
  const universityName = typeof name === "string" ? name.trim() : "";
  const selectedCountry = typeof country === "string" ? country.trim() : "";
  if (!universityName && !selectedCountry) return res.status(400).json({ error: "University name or country is required" });
  try {
    const params = new URLSearchParams();
    if (universityName) params.set("name", universityName);
    if (selectedCountry) params.set("country", selectedCountry);
    const response = await fetch(`http://universities.hipolabs.com/search?${params.toString()}`, { signal: AbortSignal.timeout(15000) });
    if (!response.ok) return res.status(502).json({ error: `University data service returned ${response.status}` });
    const data = await response.json();
    if (!Array.isArray(data)) return res.status(502).json({ error: "University data service returned an invalid response" });
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    return res.status(200).json(data);
  } catch (error) {
    console.error("University API error:", error);
    return res.status(502).json({ error: "Unable to reach the university data service" });
  }
}
