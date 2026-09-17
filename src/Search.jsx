import { useState, useMemo, useCallback } from "react";
import axios from "axios";

const COUNTRIES = ["Australia", "Austria", "Belgium", "Brazil", "Canada", "China", "Denmark", "Egypt", "Finland", "France", "Germany", "Greece", "Hong Kong", "India", "Indonesia", "Ireland", "Israel", "Italy", "Japan", "Kenya", "Malaysia", "Mexico", "Netherlands", "New Zealand", "Nigeria", "Norway", "Pakistan", "Philippines", "Poland", "Portugal", "Russia", "Saudi Arabia", "Singapore", "South Africa", "South Korea", "Spain", "Sri Lanka", "Sweden", "Switzerland", "Taiwan", "Thailand", "Turkey", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Vietnam"];

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
  const mapQuery = country ? `universities in ${country}` : "";
  const mapUrl = mapQuery ? `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed` : "";

  return <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-5">
    <div><h1 className="text-3xl font-bold text-indigo-velvet">Find a university</h1><p className="text-sm text-medium-slate-blue/70 mt-1">Search by university name, then narrow it down by country.</p></div>
    <div className="card bg-base-100 border border-medium-slate-blue/20 shadow-sm"><div className="card-body p-4"><div className="grid grid-cols-1 md:grid-cols-[1fr_260px_auto] gap-3 items-end">
      <label className="form-control"><span className="label-text font-semibold">University name</span><input className="input input-bordered w-full" placeholder="e.g. Stanford University" value={universityName} onChange={(e) => setUniversityName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && search()} /></label>
      <label className="form-control"><span className="label-text font-semibold">Country <span className="font-normal opacity-60">(optional)</span></span><select className="select select-bordered w-full" value={country} onChange={(e) => setCountry(e.target.value)}><option value="">All countries</option>{COUNTRIES.map((item) => <option key={item}>{item}</option>)}</select></label>
      <button className="btn bg-medium-slate-blue text-white hover:bg-amber-flame border-0" onClick={search} disabled={loading || (!universityName.trim() && !country.trim())}>{loading ? <><span className="loading loading-spinner loading-sm"/> Searching...</> : "Search"}</button>
    </div><p className="text-xs text-medium-slate-blue/60 mt-1">Search by name, browse by country, or use both together.</p></div></div>

    {country && <div className="card bg-base-100 border border-medium-slate-blue/20 shadow-sm overflow-hidden"><div className="card-body p-0"><div className="p-4 pb-3"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-bold text-indigo-velvet">{country} on the map</h2><p className="text-sm text-medium-slate-blue/70">University locations and search tags for the selected country.</p></div>{uni.length > 0 && <span className="badge badge-lg bg-amber-flame text-indigo-velvet border-0">{uni.length} universities</span>}</div></div><div className="relative h-[420px] w-full"><iframe title={`${country} university map`} src={mapUrl} className="w-full h-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /><div className="absolute top-4 right-4 w-[min(360px,calc(100%-2rem))] max-h-[calc(100%-2rem)] overflow-y-auto rounded-2xl bg-base-100/95 backdrop-blur shadow-xl border border-medium-slate-blue/20 p-3"><div className="text-xs font-bold uppercase tracking-wider text-medium-slate-blue/60 mb-2">University tags</div>{uni.length > 0 ? <div className="flex flex-wrap gap-2">{uni.map((u) => <a key={`${u.name}-${u.country}`} href={u.web_pages?.[0] || `https://www.google.com/search?q=${encodeURIComponent(`${u.name} ${u.country}`)}`} target="_blank" rel="noopener noreferrer" className="badge badge-outline h-auto min-h-8 py-1.5 px-3 text-left whitespace-normal hover:bg-amber-flame hover:text-indigo-velvet transition-colors">📍 {u.name}</a>)}</div> : <p className="text-sm text-medium-slate-blue/65">Run the search to load the matching university tags here.</p>}</div></div></div></div>}

    {error && <div role="alert" className="alert alert-error"><span>{error}</span><button className="btn btn-sm" onClick={search}>Retry</button></div>}
    {!loading && searched && !error && !uni.length && <div className="alert alert-info">No universities matched your search. Try a shorter university name or select a country.</div>}
    {uni.length > 0 && <div className="space-y-3"><div className="flex flex-wrap gap-2 justify-between items-center"><div className="font-semibold">{data.length} universities found</div><input className="input input-bordered input-sm max-w-xs" placeholder="Filter results..." value={queryFilter} onChange={(e) => { setQueryFilter(e.target.value); setPage(1); }}/></div>
      <div className="overflow-x-auto rounded-box border border-medium-slate-blue/20 bg-base-100 shadow-sm"><table className="table table-zebra"><thead className="bg-indigo-velvet text-white"><tr><th className="text-white">Country</th><th className="text-white cursor-pointer" onClick={() => changeSort("name")}>University {sort === "name" ? (direction === "asc" ? "▲" : "▼") : ""}</th><th className="text-white cursor-pointer" onClick={() => changeSort("state-province")}>State / Province</th><th className="text-white">Website</th></tr></thead><tbody>{visible.map((u) => <tr key={`${u.name}-${u.country}`}><td>{u.country}</td><td className="font-medium">{u.name}</td><td>{u["state-province"] || "—"}</td><td>{u.web_pages?.[0] ? <a className="link text-medium-slate-blue hover:text-tiger-orange" href={u.web_pages[0]} target="_blank" rel="noopener noreferrer">Official site ↗</a> : "—"}</td></tr>)}</tbody></table></div>
      {pages > 1 && <div className="flex justify-center join"><button className="btn btn-sm join-item" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</button><span className="btn btn-sm join-item btn-disabled">Page {page} of {pages}</span><button className="btn btn-sm join-item" disabled={page === pages} onClick={() => setPage((p) => p + 1)}>Next</button></div>}
    </div>}
  </div>;
}
