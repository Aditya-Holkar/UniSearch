export default async function handler(req, res) {
  const { name, country } = req.query;
  const universityName = typeof name === "string" ? name.trim() : "";
  const selectedCountry = typeof country === "string" ? country.trim() : "";

  if (!universityName && !selectedCountry) {
    return res.status(400).json({ error: "University name or country is required" });
  }

  try {
    const params = new URLSearchParams();
    if (universityName) params.set("name", universityName);
    if (selectedCountry) params.set("country", selectedCountry);

    const response = await fetch(
      `https://universities.hipolabs.com/search?${params.toString()}`,
    );
    if (!response.ok) {
      return res.status(response.status).json({ error: "External API request failed" });
    }

    const data = await response.json();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch universities" });
  }
}
