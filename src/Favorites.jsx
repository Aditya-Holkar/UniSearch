import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useFavorites } from "./FavoritesContext";

export default function Favorites() {
  const { favorites, toggleFav } = useFavorites();

  const grouped = useMemo(() => {
    const map = {};
    favorites.forEach((f) => {
      const c = f.country || "Unknown";
      if (!map[c]) map[c] = [];
      map[c].push(f);
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([country, items]) => [
        country,
        items.sort((a, b) => (a.name || "").localeCompare(b.name || "")),
      ]);
  }, [favorites]);

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-12 animate-[fadeIn_0.4s_ease-out]">
        <div className="text-6xl mb-2">{'\uD83D\uDC9B'}</div>
        <h2 className="text-2xl font-bold text-indigo-velvet dark:text-white">No Favorites Yet</h2>
        <p className="text-medium-slate-blue">Start searching and save universities you like!</p>
        <Link to="/search" className="btn bg-medium-slate-blue text-white hover:bg-amber-flame hover:text-white border-medium-slate-blue">
          Go to Search
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 max-w-5xl mx-auto animate-[fadeIn_0.4s_ease-out]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-indigo-velvet dark:text-white">Your Favorites</h2>
          <p className="text-medium-slate-blue text-sm mt-1">
            {favorites.length} universit{favorites.length === 1 ? "y" : "ies"} saved across {grouped.length} countr{grouped.length === 1 ? "y" : "ies"}
          </p>
        </div>
      </div>

      {grouped.map(([country, items]) => (
        <div key={country} className="collapse collapse-arrow bg-base-100 border border-medium-slate-blue/20 rounded-box">
          <input type="checkbox" defaultChecked className="peer" />
          <div className="collapse-title text-lg font-semibold text-indigo-velvet bg-indigo-velvet/5 peer-checked:bg-indigo-velvet/10">
            {country}
            <span className="badge badge-soft badge-neutral ml-2">{items.length}</span>
          </div>
          <div className="collapse-content p-0">
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>State/Province</th>
                    <th>Website</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="hover">
                      <td className="font-medium">{item.name}</td>
                      <td className="text-medium-slate-blue/70">{item["state-province"] ?? '\u2014'}</td>
                      <td>
                        {item.web_pages?.[0] ? (
                          <a href={item.web_pages[0]} target="_blank" rel="noopener noreferrer" className="link text-medium-slate-blue hover:text-tiger-orange transition-colors">
                            {item.web_pages[0]}
                          </a>
                        ) : '\u2014'}
                      </td>
                      <td>
                        <button
                          className="btn btn-xs btn-ghost"
                          onClick={() => toggleFav(item)}
                          aria-label={`Remove ${item.name} from favorites`}
                        >
                          <span className="text-amber-flame">{'\u2764\uFE0F'}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
