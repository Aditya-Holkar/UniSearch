import { useState, useEffect, useCallback } from "react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar({ theme, setTheme }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = useCallback(() => setMobileOpen(false), []);
  useEffect(() => { document.body.style.overflow = mobileOpen ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [mobileOpen]);
  useEffect(() => { const handler = (e) => e.key === "Escape" && closeMobile(); document.addEventListener("keydown", handler); return () => document.removeEventListener("keydown", handler); }, [closeMobile]);
  useEffect(() => { const resize = () => window.innerWidth >= 768 && setMobileOpen(false); window.addEventListener("resize", resize); return () => window.removeEventListener("resize", resize); }, []);
  const pClass = ({ isActive }) => `px-4 py-2 rounded-lg font-medium transition-all duration-200 ${isActive ? "text-tiger-orange border-b-2 border-tiger-orange" : "text-white/70 hover:text-amber-flame"}`;
  const mobileClass = ({ isActive }) => isActive ? "text-tiger-orange font-bold" : "text-white/70 hover:text-amber-flame";
  return <><div className={`fixed inset-0 bg-black/50 z-40 lg:hidden ${mobileOpen ? "overlay-visible" : ""}`} onClick={closeMobile}/><div className={`fixed top-0 right-0 h-full w-72 bg-indigo-velvet z-50 lg:hidden ${mobileOpen ? "drawer-open" : ""}`}><div className="flex justify-end p-3"><button className="btn btn-ghost text-white btn-circle" onClick={closeMobile}>✕</button></div><ul className="menu p-4"><li><NavLink to="/" end className={mobileClass} onClick={closeMobile}>Home</NavLink></li><li><NavLink to="/search" className={mobileClass} onClick={closeMobile}>Find Universities</NavLink></li></ul></div><div className="navbar bg-indigo-velvet shadow-lg sticky top-0 z-30 px-4 min-h-16"><div className="navbar-start"><button className="btn btn-ghost text-white lg:hidden" onClick={() => setMobileOpen(true)}>☰</button><Link to="/" className="btn btn-ghost text-xl text-white hover:text-amber-flame">UniSearch</Link></div><div className="navbar-center hidden lg:flex"><ul className="flex items-center gap-1"><li><NavLink to="/" end className={pClass}>Home</NavLink></li><li><NavLink to="/search" className={pClass}>Find Universities</NavLink></li></ul></div><div className="navbar-end"><button className="btn btn-ghost btn-circle text-white/80 hover:text-amber-flame" onClick={() => setTheme((t) => t === "light" ? "dark" : "light")} aria-label="Toggle theme">{theme === "light" ? "🌙" : "☀️"}</button></div></div></>;
}
