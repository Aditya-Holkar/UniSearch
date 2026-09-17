import { useState, useMemo, useCallback, useRef } from "react";
import axios from "axios";
import { useFavorites, favKey as contextFavKey } from "./FavoritesContext";

const COUNTRIES = [
  "Australia", "Austria", "Belgium", "Brazil", "Canada", "China", "Denmark",
  "Egypt", "Finland", "France", "Germany", "Greece", "Hong Kong", "India",
  "Indonesia", "Ireland", "Israel", "Italy", "Japan", "Kenya", "Malaysia",
  "Mexico", "Netherlands", "New Zealand", "Nigeria", "Norway", "Pakistan",
  "Philippines", "Poland", "Portugal", "Russia", "Saudi Arabia", "Singapore",
  "South Africa", "South Korea", "Spain", "Sri Lanka", "Sweden", "Switzerland",
  "Taiwan", "Thailand", "Turkey", "Uganda", "Ukraine", "United Arab Emirates",
  "United Kingdom", "United States", "Vietnam"
];

function App() {
  const { favorites, toggleFav: toggleFavContext, isFavorite } = useFavorites();
  const favKey = contextFavKey;
  const [universityName, setUniversityName] = useState("");
  const [country, setCountry] = useState("");
  const [uni, setUni] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [activeTab, setActiveTab] = useState("all");
  const [animatingIdx, setAnimatingIdx] = useState(null);
  const [nameFilter, setNameFilter] = useState("");
  const [filterInput, setFilterInput] = useState("");
  const [selectedRows, setSelectedRows] = useState(new Set());
  const filterTimer = useRef(null);
  const perPage = 10;

  const isFav = useCallback((params) => isFavorite(params), [isFavorite]);
  const toggleFav = useCallback((params, idx) => {
    if (!isFavorite(params)) {
      setAnimatingIdx(idx);
      setTimeout(() => setAnimatingIdx(null), 350);
    }
    toggleFavContext(params);
  }, [toggleFavContext, isFavorite]);

  const uniApi = useCallback(async () => {
    const name = universityName.trim();
    const selectedCountry = country.trim();
    if (!name && !selectedCountry) return;
    setLoading(true);
    setError(null);
    setSearched(false);
    setPage(1);
    setSortKey(null);
    setActiveTab("all");
    setNameFilter("");
    setFilterInput("");
    setSelectedRows(new Set());
    try {
      const params = new URLSearchParams();
      if (name) params.set("name", name);
      if (selectedCountry) params.set("country", selectedCountry);
      const { data } = await axios.get(`/api/universities?${params.toString()}`);
      setUni(data);
    } catch {
      setError("Failed to fetch universities. Please try a different name or country.");
      setUni([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  }, [universityName, country]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter") uniApi();
  }, [uniApi]);

  const handleSort = useCallback((key) => {
    setSortKey((prev) => {
      if (prev === key) setSortDir((d) => d === "asc" ? "desc" : "asc");
      else setSortDir("asc");
      return prev === key ? prev : key;
    });
    setPage(1);
  }, []);

  const handleFilterChange = useCallback((value) => {
    setFilterInput(value);
    if (filterTimer.current) clearTimeout(filterTimer.current);
    filterTimer.current = setTimeout(() => {
      setNameFilter(value);
      setPage(1);
      setSelectedRows(new Set());
    }, 300);
  }, []);

  const clearFilter = useCallback(() => {
    setFilterInput("");
    setNameFilter("");
    setPage(1);
    setSelectedRows(new Set());
  }, []);

  const filteredData = useMemo(() => {
    let data = activeTab === "fav" ? favorites.map((f) => ({
      name: f.name, country: f.country, "state-province": f["state-province"],
      web_pages: f.web_pages, domains: f.domains,
    })) : uni;
    if (nameFilter) {
      const q = nameFilter.toLowerCase();
      data = data.filter((u) => u.name?.toLowerCase().includes(q));
    }
    return data;
  }, [uni, activeTab, favorites, nameFilter]);

  const displayData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const va = (a[sortKey] ?? "").toLowerCase();
      const vb = (b[sortKey] ?? "").toLowerCase();
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(displayData.length / perPage));
  const paged = displayData.slice((page - 1) * perPage, page * perPage);
  const allSelected = paged.length > 0 && paged.every((u) => selectedRows.has(favKey(u)));

  const toggleSelectAll = useCallback(() => {
    if (allSelected) {
      setSelectedRows(new Set([...selectedRows].filter((k) => !paged.some((u) => favKey(u) === k))));
    } else {
      const next = new Set(selectedRows);
      paged.forEach((u) => next.add(favKey(u)));
      setSelectedRows(next);
    }
  }, [allSelected, selectedRows, paged, favKey]);

  const toggleRow = useCallback((key) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }, []);

  const sortIndicator = (key) => sortKey !== key ? "" : sortDir === "asc" ? " ▲" : " ▼";

  const copyDomain = async (url, idx) => {
    try {
      const domain = new URL(url).hostname;
      await navigator.clipboard.writeText(domain);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch {}
  };

  const exportCSV = useCallback((mode) => {
    const source = mode === "selected" ? displayData.filter((u) => selectedRows.has(favKey(u))) : displayData;
    if (!source.length) return;
    const headers = ["Country", "Name", "State/Province", "Website"];
    const rows = source.map((u) => [u.country, u.name, u["state-province"] || "", u.web_pages?.[0] || ""]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "universities.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }, [displayData, selectedRows, favKey]);

  const favCount = favorites.length;

  return (
    <div className="flex flex-col gap-4 p-4 animate-[fadeIn_0.4s_ease-out]">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-indigo-velvet">Find a university</h1>
          <p className="text-sm text-medium-slate-blue/70">Search by university name, then narrow it down by country.</p>
        </div>
        <div className="join">
          <button className={`join-item btn btn-sm ${viewMode === "table" ? "btn-active" : ""}`} onClick={() => setViewMode("table")}>Table</button>
          <button className={`join-item btn btn-sm ${viewMode === "card" ? "btn-active" : ""}`} onClick={() => setViewMode("card")}>Cards</button>
        </div>
      </div>

      <div className="card bg-base-100 border border-medium-slate-blue/20 shadow-sm">
        <div className="card-body p-4">
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_260px_auto] gap-3 items-end">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">University name</legend>
              <input type="text" className="input w-full focus:border-amber-flame focus:ring-amber-flame/20" placeholder="e.g. Stanford University" value={universityName} onChange={(e) => setUniversityName(e.target.value)} onKeyDown={handleKeyDown} />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Country <span className="font-normal opacity-60">(optional)</span></legend>
              <select className="select w-full focus:border-amber-flame" value={country} onChange={(e) => setCountry(e.target.value)}>
                <option value="">All countries</option>
                {COUNTRIES.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </fieldset>
            <button className="btn bg-medium-slate-blue text-white hover:bg-amber-flame hover:text-white border-medium-slate-blue" onClick={uniApi} disabled={loading || (!universityName.trim() && !country.trim())}>
              {loading && <span className="loading loading-spinner" />}
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
          <p className="text-xs text-medium-slate-blue/60 mt-1">Tip: enter a university name for a focused search, or choose a country to browse universities there.</p>
        </div>
      </div>

      {error && <div role="alert" className="alert alert-error"><span>{error}</span></div>}
      {!loading && searched && !error && uni.length === 0 && <div role="alert" className="alert alert-info"><span>No universities found. Try a broader university name or another country.</span></div>}

      {searched && !error && uni.length > 0 && <div role="tablist" className="tabs tabs-box">
        <button role="tab" className={`tab ${activeTab === "all" ? "tab-active font-semibold text-indigo-velvet" : ""}`} onClick={() => { setActiveTab("all"); setPage(1); setSelectedRows(new Set()); }}>Results ({uni.length})</button>
        <button role="tab" className={`tab ${activeTab === "fav" ? "tab-active font-semibold text-indigo-velvet" : ""}`} onClick={() => { setActiveTab("fav"); setPage(1); setSelectedRows(new Set()); }}>Favorites ({favCount})</button>
      </div>}

      {displayData.length > 0 && <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="join flex-1 max-w-sm">
            <input type="text" className="input input-bordered join-item flex-1 focus:border-amber-flame focus:ring-amber-flame/20" placeholder="Refine by university name..." value={filterInput} onChange={(e) => handleFilterChange(e.target.value)} />
            {filterInput && <button className="btn btn-ghost join-item" onClick={clearFilter} aria-label="Clear filter">✕</button>}
          </div>
          <div className="flex items-center gap-2">
            {selectedRows.size > 0 && <span className="badge badge-soft badge-neutral">{selectedRows.size} selected</span>}
            <div className="dropdown dropdown-end">
              <button tabIndex={0} className="btn btn-sm btn-outline border-amber-flame text-amber-flame hover:bg-tiger-orange hover:text-white hover:border-tiger-orange">Export CSV ▾</button>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box z-10 w-48">
                <li><button onClick={() => exportCSV("all")} className="text-sm">Export All ({displayData.length})</button></li>
                <li><button onClick={() => exportCSV("selected")} className="text-sm" disabled={!selectedRows.size}>Export Selected ({selectedRows.size})</button></li>
              </ul>
            </div>
          </div>
        </div>
        {nameFilter && <p className="text-xs text-medium-slate-blue">Filtered to {displayData.length} of {activeTab === "all" ? uni.length : favCount} results</p>}

        {viewMode === "table" ? <div className="overflow-x-auto rounded-box border border-medium-slate-blue/20 bg-base-100 shadow-sm">
          <table className="table table-zebra">
            <thead className="bg-indigo-velvet text-white"><tr>
              <th className="text-white/90"><input type="checkbox" className="checkbox checkbox-sm border-white/40 checked:bg-amber-flame checked:border-amber-flame" checked={allSelected} onChange={toggleSelectAll} aria-label="Select all rows on this page" /></th>
              <th className="text-white/90" />
              <th className="cursor-pointer select-none text-white/90 hover:text-tiger-orange" onClick={() => handleSort("country")}>Country{sortIndicator("country")}</th>
              <th className="cursor-pointer select-none text-white/90 hover:text-tiger-orange" onClick={() => handleSort("name")}>Name of University{sortIndicator("name")}</th>
              <th className="cursor-pointer select-none text-white/90 hover:text-tiger-orange" onClick={() => handleSort("state-province")}>State/Province{sortIndicator("state-province")}</th>
              <th className="text-white/90">Official website</th>
            </tr></thead>
            <tbody>{paged.map((params, idx) => {
              const key = favKey(params); const globalIdx = (page - 1) * perPage + idx;
              return <tr key={globalIdx} className="hover">
                <th><input type="checkbox" className="checkbox checkbox-sm checked:bg-amber-flame checked:border-amber-flame" checked={selectedRows.has(key)} onChange={() => toggleRow(key)} aria-label="Select row" /></th>
                <th><button className={`btn btn-xs btn-ghost ${animatingIdx === globalIdx ? "heart-pop" : ""}`} onClick={(e) => { e.stopPropagation(); toggleFav(params, globalIdx); }} aria-label={isFav(params) ? "Remove from favorites" : "Add to favorites"}><span className={isFav(params) ? "text-amber-flame" : ""}>{isFav(params) ? "❤️" : "🤍"}</span></button></th>
                <td>{params.country}</td><td className="font-medium">{params.name}</td><td>{params["state-province"] ?? "—"}</td>
                <td className="flex gap-2 items-center"><a href={params.web_pages?.[0]} target="_blank" rel="noopener noreferrer" className="link text-medium-slate-blue hover:text-tiger-orange truncate max-w-[180px] transition-colors">{params.web_pages?.[0] || "—"}</a>{params.web_pages?.[0] && <button className="btn btn-xs btn-ghost shrink-0 text-medium-slate-blue hover:text-indigo-velvet" onClick={() => copyDomain(params.web_pages[0], globalIdx)}>{copiedIdx === globalIdx ? "Copied!" : "Copy"}</button>}</td>
              </tr>;
            })}</tbody>
          </table>
        </div> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paged.map((params, idx) => {
            const key = favKey(params); const globalIdx = (page - 1) * perPage + idx;
            return <div key={globalIdx} className="card bg-base-100 border border-medium-slate-blue/20 transition-transform duration-200 hover:scale-[1.02] hover:shadow-md shadow-sm"><div className="card-body">
              <div className="flex items-start justify-between gap-2"><div className="flex items-center gap-2"><input type="checkbox" className="checkbox checkbox-sm checked:bg-amber-flame checked:border-amber-flame" checked={selectedRows.has(key)} onChange={() => toggleRow(key)} aria-label="Select row" /><h2 className="card-title text-base">{params.name}</h2></div><button className={`btn btn-xs btn-ghost shrink-0 ${animatingIdx === globalIdx ? "heart-pop" : ""}`} onClick={(e) => { e.stopPropagation(); toggleFav(params, globalIdx); }} aria-label={isFav(params) ? "Remove from favorites" : "Add to favorites"}><span className={isFav(params) ? "text-amber-flame" : ""}>{isFav(params) ? "❤️" : "🤍"}</span></button></div>
              <p className="text-sm text-medium-slate-blue/70">{params.country}{params["state-province"] ? ` — ${params["state-province"]}` : ""}</p>
              <div className="card-actions justify-between items-center mt-2"><a href={params.web_pages?.[0]} target="_blank" rel="noopener noreferrer" className="link text-medium-slate-blue hover:text-tiger-orange text-sm truncate max-w-[180px] transition-colors">{params.web_pages?.[0] || "No website"}</a>{params.web_pages?.[0] && <button className="btn btn-xs btn-ghost shrink-0 text-medium-slate-blue hover:text-indigo-velvet" onClick={() => copyDomain(params.web_pages[0], globalIdx)}>{copiedIdx === globalIdx ? "Copied!" : "Copy"}</button>}</div>
            </div></div>;
          })}
        </div>}

        {totalPages > 1 && <div className="join self-center"><button className="join-item btn btn-sm border-medium-slate-blue/30 text-medium-slate-blue hover:bg-indigo-velvet hover:text-amber-flame hover:border-amber-flame" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</button><span className="join-item btn btn-sm btn-disabled border-medium-slate-blue/30">Page {page} of {totalPages}</span><button className="join-item btn btn-sm border-medium-slate-blue/30 text-medium-slate-blue hover:bg-indigo-velvet hover:text-amber-flame hover:border-amber-flame" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</button></div>}
      </div>}
    </div>
  );
}

export default App;
