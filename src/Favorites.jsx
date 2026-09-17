import { useMemo } from "react";
import { Link } from "react-router-dom";
import { APPLICATION_STATUSES, useFavorites } from "./FavoritesContext";

export default function Favorites() {
  const { favorites, toggleFav, updateFavorite } = useFavorites();

  const grouped = useMemo(() => {
    const map = {};
    favorites.forEach((f) => {
      const c = f.country || "Unknown";
      if (!map[c]) map[c] = [];
      map[c].push(f);
    });
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [favorites]);

  if (favorites.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">💛</div>
          <h2 className="text-3xl font-bold text-indigo-velvet dark:text-white">Your shortlist is empty</h2>
          <p className="text-medium-slate-blue mt-3">Save universities from Search to start building your study-abroad shortlist.</p>
          <Link to="/search" className="btn mt-6 bg-medium-slate-blue text-white border-medium-slate-blue hover:bg-amber-flame">Find universities</Link>
        </div>
      </div>
    );
  }

  const counts = APPLICATION_STATUSES.map((status) => [status, favorites.filter((f) => f.status === status).length]);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 animate-[fadeIn_0.4s_ease-out]">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-tiger-orange">My shortlist</p>
          <h1 className="text-3xl font-extrabold text-indigo-velvet dark:text-white mt-1">Universities I’m considering</h1>
          <p className="text-medium-slate-blue mt-2">Track where each university sits in your decision process.</p>
        </div>
        <Link to="/compare" className="btn bg-indigo-velvet text-white hover:bg-amber-flame border-indigo-velvet">Compare shortlist</Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {counts.map(([status, count]) => (
          <div key={status} className="rounded-xl border border-medium-slate-blue/15 bg-base-100 p-4">
            <div className="text-2xl font-bold text-indigo-velvet dark:text-white">{count}</div>
            <div className="text-sm text-medium-slate-blue mt-1">{status}</div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {grouped.map(([country, items]) => (
          <section key={country} className="rounded-2xl border border-medium-slate-blue/15 bg-base-100 overflow-hidden shadow-sm">
            <div className="px-5 py-4 bg-indigo-velvet/5 flex items-center justify-between">
              <h2 className="font-bold text-lg text-indigo-velvet dark:text-white">{country}</h2>
              <span className="badge badge-soft">{items.length}</span>
            </div>
            <div className="divide-y divide-base-300">
              {items.map((item) => (
                <article key={item.id} className="p-5 grid lg:grid-cols-[1fr_180px_1fr_auto] gap-4 items-start">
                  <div>
                    <h3 className="font-bold text-lg text-indigo-velvet dark:text-white">{item.name}</h3>
                    <p className="text-sm text-medium-slate-blue mt-1">{item["state-province"] || "Location not listed"}</p>
                    {item.web_pages?.[0] && <a href={item.web_pages[0]} target="_blank" rel="noopener noreferrer" className="link text-sm text-medium-slate-blue hover:text-tiger-orange mt-2 inline-block">Official website ↗</a>}
                  </div>
                  <label className="form-control">
                    <span className="label-text text-xs font-semibold mb-1">Application status</span>
                    <select className="select select-sm select-bordered w-full" value={item.status || "Researching"} onChange={(e) => updateFavorite(item.id, { status: e.target.value })}>
                      {APPLICATION_STATUSES.map((status) => <option key={status}>{status}</option>)}
                    </select>
                  </label>
                  <label className="form-control">
                    <span className="label-text text-xs font-semibold mb-1">Private note</span>
                    <input className="input input-sm input-bordered w-full" placeholder="e.g. Strong CS program" value={item.note || ""} onChange={(e) => updateFavorite(item.id, { note: e.target.value })} />
                  </label>
                  <button className="btn btn-sm btn-ghost text-amber-flame" onClick={() => toggleFav(item)} aria-label={`Remove ${item.name} from favorites`}>Remove</button>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
