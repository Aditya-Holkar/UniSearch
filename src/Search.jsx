import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import axios from "axios";

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
  "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
  "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function UniversityMap({ country, universities }) {
  const mapElement = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);

  const [locations, setLocations] = useState([]);
  const [geocoding, setGeocoding] = useState(false);
  const [geocodeMessage, setGeocodeMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function geocodeUniversities() {
      if (!country || !universities.length) {
        setLocations([]);
        return;
      }

      setGeocoding(true);
      setGeocodeMessage("");
      const results = [];

      for (const university of universities) {
        if (cancelled) return;
        const parts = [university.name, university["state-province"], university.country].filter(Boolean);
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(parts.join(", "))}`, {
            headers: { Accept: "application/json" },
          });
          if (response.ok) {
            const data = await response.json();
            if (data[0]) results.push({ university, lat: Number(data[0].lat), lng: Number(data[0].lon) });
          }
        } catch {
          // Keep the map usable if an individual university cannot be geocoded.
        }
        await wait(1100);
      }

      if (!cancelled) {
        setLocations(results);
        setGeocoding(false);
        setGeocodeMessage(results.length ? `${results.length} university location${results.length === 1 ? "" : "s"} mapped.` : "University locations could not be found for this result set.");
      }
    }

    geocodeUniversities();
    return () => { cancelled = true; };
  }, [country, universities]);

  useEffect(() => {
    if (!mapElement.current || !window.L || !country) return undefined;

    map.current = window.L.map(mapElement.current, { scrollWheelZoom: true }).setView([20, 0], 2);
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map.current);

    return () => {
      markers.current.forEach((marker) => marker.remove());
      markers.current = [];
      map.current?.remove();
      map.current = null;
    };
  }, [country]);

  useEffect(() => {
    if (!map.current || !window.L) return;

    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    if (!locations.length) return;

    const bounds = window.L.latLngBounds();
    locations.forEach(({ university, lat, lng }) => {
      const marker = window.L.marker([lat, lng]).addTo(map.current);
      const website = university.web_pages?.[0];
      marker.bindPopup(`<strong>${escapeHtml(university.name)}</strong>${university["state-province"] ? `<br>${escapeHtml(university["state-province"])}` : ""}${website ? `<br><a href="${escapeAttribute(website)}" target="_blank" rel="noopener noreferrer">Official site ↗</a>` : ""}`);
      markers.current.push(marker);
      bounds.extend([lat, lng]);
    });

    map.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 7 });
  }, [locations]);

  return <div className="card bg-base-100 border border-medium-slate-blue/20 shadow-sm overflow-hidden"><div className="card-body p-0"><div className="p-4 pb-3"><div className="flex flex-wrap items-center justify-between gap-2"><div><h2 className="text-lg font-bold text-indigo-velvet">{country} university map</h2><p className="text-sm text-medium-slate-blue/70">Real map pins are generated from the universities currently shown on this page.</p></div>{geocoding && <span className="badge badge-outline">Mapping locations…</span>}</div>{geocodeMessage && !geocoding && <p className="text-xs text-medium-slate-blue/60 mt-2">{geocodeMessage}</p>}</div><div ref={mapElement} className="h-[420px] w-full" /></div></div>;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#96;");
}

export default function Search() {
  const [universityName, setUniversityName] = useState("");
  const [country, setCountry] = useState("");
  const [uni, setUni] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [queryFilter, setQueryFilter] = useState("");
  const [sort, setSort] = useState("name");
  const [direction, setDirection] = useState("asc");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const search = useCallback(async () => {
    const name = universityName.trim(); const selectedCountry = country.trim();
    if (!name && !selectedCountry) return;
    setLoading(true); setError(""); setSearched(false); setPage(1); setQueryFilter("");
    try {
      const params = new URLSearchParams(); if (name) params.set("name", name); if (selectedCountry) params.set("country", selectedCountry);
      const { data } = await axios.get(`/api/universities?${params.toString()}`, { timeout: 15000 });
      if (!Array.isArray(data)) throw new Error("Invalid response");
      setUni(data);
    } catch (err) {
      setUni([]); setError(err.response?.data?.error || "The university service is unavailable right now. Please try again.");
    } finally { setLoading(false); setSearched(true); }
  }, [universityName, country]);

  const data = useMemo(() => {
    const filtered = uni.filter((u) => !queryFilter || u.name?.toLowerCase().includes(queryFilter.toLowerCase()));
    return [...filtered].sort((a, b) => String(a[sort] || "").toLowerCase().localeCompare(String(b[sort] || "").toLowerCase()) * (direction === "asc" ? 1 : -1));
  }, [uni, queryFilter, sort, direction]);
  const pages = Math.max(1, Math.ceil(data.length / perPage));
  const visible = data.slice((page - 1) * perPage, page * perPage);
  const changeSort = (key) => { if (sort === key) setDirection((d) => d === "asc" ? "desc" : "asc"); else { setSort(key); setDirection("asc"); } setPage(1); };

  return <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-5">
    <div><h1 className="text-3xl font-bold text-indigo-velvet">Find a university</h1><p className="text-sm text-medium-slate-blue/70 mt-1">Search by university name, then narrow it down by country.</p></div>
    <div className="card bg-base-100 border border-medium-slate-blue/20 shadow-sm"><div className="card-body p-4"><div className="grid grid-cols-1 md:grid-cols-[1fr_260px_auto] gap-3 items-end">
      <label className="form-control"><span className="label-text font-semibold">University name</span><input className="input input-bordered w-full" placeholder="e.g. Stanford University" value={universityName} onChange={(e) => setUniversityName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && search()} /></label>
      <label className="form-control"><span className="label-text font-semibold">Country <span className="font-normal opacity-60">(optional)</span></span><select className="select select-bordered w-full" value={country} onChange={(e) => setCountry(e.target.value)}><option value="">All countries</option>{COUNTRIES.map((item) => <option key={item}>{item}</option>)}</select></label>
      <button className="btn bg-medium-slate-blue text-white hover:bg-amber-flame border-0" onClick={search} disabled={loading || (!universityName.trim() && !country.trim())}>{loading ? <><span className="loading loading-spinner loading-sm"/> Searching...</> : "Search"}</button>
    </div><p className="text-xs text-medium-slate-blue/60 mt-1">Search by name, browse by country, or use both together.</p></div></div>

    {country && data.length > 0 && <UniversityMap country={country} universities={visible} />}

    {error && <div role="alert" className="alert alert-error"><span>{error}</span><button className="btn btn-sm" onClick={search}>Retry</button></div>}
    {!loading && searched && !error && !uni.length && <div className="alert alert-info">No universities matched your search. Try a shorter university name or select a country.</div>}
    {uni.length > 0 && <div className="space-y-3"><div className="flex flex-wrap gap-2 justify-between items-center"><div className="font-semibold">{data.length} universities found</div><input className="input input-bordered input-sm max-w-xs" placeholder="Filter results..." value={queryFilter} onChange={(e) => { setQueryFilter(e.target.value); setPage(1); }}/></div>
      <div className="overflow-x-auto rounded-box border border-medium-slate-blue/20 bg-base-100 shadow-sm"><table className="table table-zebra"><thead className="bg-indigo-velvet text-white"><tr><th className="text-white">Country</th><th className="text-white cursor-pointer" onClick={() => changeSort("name")}>University {sort === "name" ? (direction === "asc" ? "▲" : "▼") : ""}</th><th className="text-white cursor-pointer" onClick={() => changeSort("state-province")}>State / Province</th><th className="text-white">Website</th></tr></thead><tbody>{visible.map((u) => <tr key={`${u.name}-${u.country}`}><td>{u.country}</td><td className="font-medium">{u.name}</td><td>{u["state-province"] || "—"}</td><td>{u.web_pages?.[0] ? <a className="link text-medium-slate-blue hover:text-tiger-orange" href={u.web_pages[0]} target="_blank" rel="noopener noreferrer">Official site ↗</a> : "—"}</td></tr>)}</tbody></table></div>
      {pages > 1 && <div className="flex justify-center join"><button className="btn btn-sm join-item" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</button><span className="btn btn-sm join-item btn-disabled">Page {page} of {pages}</span><button className="btn btn-sm join-item" disabled={page === pages} onClick={() => setPage((p) => p + 1)}>Next</button></div>}
    </div>}
  </div>;
}
