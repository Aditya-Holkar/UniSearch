export default async function handler(req, res) {
  const { country } = req.query;

  if (!country || !country.trim()) {
    return res.status(400).json({ error: "Country parameter is required" });
  }

  try {
    const response = await fetch(
      `http://universities.hipolabs.com/search?country=${encodeURIComponent(country)}`,
    );
    if (!response.ok) {
      return res.status(response.status).json({ error: "External API request failed" });
    }
    const data = await response.json();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch universities" });
  }
}
