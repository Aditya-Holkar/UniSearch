import { useState, useEffect } from "react";

export default function VisitorCounter({ namespace = "university-app", className = "" }) {
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [onlineNow, setOnlineNow] = useState(0);

  const dailyKey = `${namespace}/daily_count`;
  const lastVisitKey = `${namespace}/last_visit`;
  const dailyVisitors = Number(localStorage.getItem(dailyKey) || 0);

  useEffect(() => {
    fetch(`https://api.countapi.xyz/hit/${namespace}/visitors`)
      .then((r) => r.json())
      .then((d) => setTotalVisitors(d.value))
      .catch(() => {});

    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem(lastVisitKey);

    if (lastVisit !== today) {
      localStorage.setItem(lastVisitKey, today);
      const prev = Number(localStorage.getItem(dailyKey) || 0);
      localStorage.setItem(dailyKey, prev + 1);
    }

    fetch(`https://api.countapi.xyz/get/${namespace}/online`)
      .then((r) => r.json())
      .then((d) => setOnlineNow(d.value || 0))
      .catch(() => {});
  }, [namespace, dailyKey, lastVisitKey]);

  return (
    <div className={`stats shadow ${className}`}>
      <div className="stat">
        <div className="stat-title">Total Visitors</div>
        <div className="stat-value text-indigo-velvet">{totalVisitors.toLocaleString()}</div>
      </div>
      <div className="stat">
        <div className="stat-title">Today</div>
        <div className="stat-value text-amber-flame">{dailyVisitors.toLocaleString()}</div>
      </div>
      <div className="stat">
        <div className="stat-title">Online Now</div>
        <div className="stat-value text-tiger-orange">{onlineNow}</div>
      </div>
    </div>
  );
}
