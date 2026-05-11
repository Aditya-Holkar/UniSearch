import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function load(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

const DEFAULT = { routes: {}, daily: {}, totals: { allTime: 0, today: 0 } };

export default function PageViews({ storageKey = "uni-pageviews", className = "" }) {
  const location = useLocation();
  const [stats, setStats] = useState(() => load(storageKey, DEFAULT));

  useEffect(() => {
    const route = location.pathname;
    const d = today();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStats((prev) => {
      const next = {
        routes: { ...prev.routes, [route]: (prev.routes[route] || 0) + 1 },
        daily: { ...prev.daily, [d]: (prev.daily[d] || 0) + 1 },
        totals: {
          allTime: prev.totals.allTime + 1,
          today: (prev.daily[d] || 0) + 1,
        },
      };
      save(storageKey, next);
      return next;
    });
  }, [location.pathname, storageKey]);

  const topRoutes = Object.entries(stats.routes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className={`stats shadow ${className}`}>
      <div className="stat">
        <div className="stat-title">All-Time Views</div>
        <div className="stat-value text-indigo-velvet">{stats.totals.allTime.toLocaleString()}</div>
      </div>
      <div className="stat">
        <div className="stat-title">Today</div>
        <div className="stat-value text-amber-flame">{stats.totals.today.toLocaleString()}</div>
      </div>
      <div className="stat">
        <div className="stat-title">Top Page</div>
        <div className="stat-value text-tiger-orange text-sm truncate max-w-28">
          {topRoutes.length > 0 ? topRoutes[0][0] : "\u2014"}
        </div>
        <div className="stat-desc">
          {topRoutes.length > 0 ? `${topRoutes[0][1]} views` : ""}
        </div>
      </div>
    </div>
  );
}
