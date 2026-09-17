import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useFavorites } from "./FavoritesContext";

const fields = [
  ["Country", (u) => u.country || "—"],
  ["State / Province", (u) => u["state-province"] || "—"],
  ["Website", (u) => u.web_pages?.[0] || "—"],
  ["Domain", (u) => u.domains?.[0] || "—"],
  ["Status", (u) => u.status || "Researching"],
];

export default function Compare() {
  const { favorites } = useFavorites();
  const [selected, setSelected] = useState(() => favorites.slice(0, 3).map((u) => u.id));

  const selectedUniversities = useMemo(
    () => favorites.filter((u) => selected.includes(u.id)),
    [favorites, selected],
  );

  const toggle = (id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 4 ? [...prev, id] : prev);
  };

  if (favorites.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚖️</div>
          <h1 className="text-3xl font-bold text-indigo-velvet dark:text-white">Build a comparison</h1>
          <p className="mt-3 text-medium-slate-blue">Save universities first, then compare up to four of them side by side.</p>
          <Link to="/search" className="btn mt-6 bg-medium-slate-blue text-white border-medium-slate-blue hover:bg-amber-flame">Explore universities</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 animate-[fadeIn_0.4s_ease-out]">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-tiger-orange">Decision workspace</p>
        <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-velvet dark:text-white mt-1">Compare your shortlist</h1>
        <p className="text-medium-slate-blue mt-2">Pick up to four saved universities and compare the information UniSearch currently has.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {favorites.map((u) => (
          <button
            key={u.id}
            onClick={() => toggle(u.id)}
            className={`btn btn-sm rounded-full ${selected.includes(u.id) ? "bg-indigo-velvet text-white" : "btn-outline"}`}
          >
            {selected.includes(u.id) ? "✓ " : ""}{u.name}
          </button>
        ))}
      </div>

      {selectedUniversities.length === 0 ? (
        <div className="alert bg-base-100 border border-medium-slate-blue/20">Select at least one university above.</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-medium-slate-blue/20 bg-base-100 shadow-sm">
          <table className="table">
            <thead>
              <tr className="bg-indigo-velvet text-white">
                <th className="text-white/80 w-40">Criteria</th>
                {selectedUniversities.map((u) => <th key={u.id} className="text-white min-w-56">{u.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {fields.map(([label, getValue]) => (
                <tr key={label} className="hover">
                  <th>{label}</th>
                  {selectedUniversities.map((u) => (
                    <td key={u.id}>
                      {label === "Website" && getValue(u) !== "—" ? (
                        <a className="link text-medium-slate-blue hover:text-tiger-orange break-all" href={getValue(u)} target="_blank" rel="noopener noreferrer">Visit website</a>
                      ) : getValue(u)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="rounded-2xl bg-indigo-velvet/5 border border-medium-slate-blue/10 p-5">
        <h2 className="font-bold text-indigo-velvet dark:text-white">What to check next</h2>
        <div className="grid sm:grid-cols-3 gap-3 mt-4 text-sm text-medium-slate-blue">
          <div>🎓 Program fit — verify the exact course and intake.</div>
          <div>💰 Cost — check official tuition, living costs and scholarships.</div>
          <div>📅 Deadlines — confirm application and visa timelines on official sites.</div>
        </div>
      </div>
    </div>
  );
}
