import { useState, useEffect, useCallback } from "react";
import { Link, NavLink } from "react-router-dom";
import { useFavorites } from "./FavoritesContext";

export default function Navbar({ theme, setTheme }) {
  const { favorites } = useFavorites();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") closeMobile(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [closeMobile]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const pClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
      isActive
        ? "text-tiger-orange border-b-2 border-tiger-orange"
        : "text-white/70 hover:text-amber-flame hover:border-b-2 hover:border-tiger-orange/50"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    isActive ? "text-tiger-orange font-bold" : "text-white/70 hover:text-amber-flame";

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden drawer-overlay ${mobileOpen ? "overlay-visible" : ""}`}
        onClick={closeMobile}
      />

      <div className={`fixed top-0 right-0 h-full w-72 bg-indigo-velvet z-50 lg:hidden drawer-panel ${mobileOpen ? "drawer-open" : ""}`}>
        <div className="flex justify-end p-3">
          <button className="btn btn-ghost text-white btn-circle" onClick={closeMobile} aria-label="Close menu">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <ul className="menu p-4">
          <li>
            <NavLink to="/" end className={mobileLinkClass} onClick={closeMobile}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/search" className={mobileLinkClass} onClick={closeMobile}>
              Search
            </NavLink>
          </li>
          <li>
            <NavLink to="/favorites" className={mobileLinkClass} onClick={closeMobile}>
              Favorites
              {favorites.length > 0 && (
                <span className="badge badge-sm bg-amber-flame text-indigo-velvet ml-auto">{favorites.length}</span>
              )}
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="navbar bg-indigo-velvet shadow-lg sticky top-0 z-30 px-4 min-h-16">
        <div className="navbar-start">
          <button className="btn btn-ghost text-white lg:hidden hamburger-btn" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link to="/" className="btn btn-ghost text-xl text-white hover:text-amber-flame transition-colors">
            UniSearch
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="flex items-center gap-1">
            <li>
              <NavLink to="/" end className={pClass}>Home</NavLink>
            </li>
            <li>
              <NavLink to="/search" className={pClass}>Search</NavLink>
            </li>
            <li>
              <NavLink to="/favorites" className={pClass}>
                Favorites
                {favorites.length > 0 && (
                  <span className="badge badge-sm bg-amber-flame text-indigo-velvet ml-1">{favorites.length}</span>
                )}
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="navbar-end">
          <button
            className="btn btn-ghost btn-circle text-white/80 hover:text-amber-flame transition-colors"
            onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
            aria-label="Toggle theme"
          >
            {theme === "light" ? "\uD83C\uDF19" : "\u2600\uFE0F"}
          </button>
        </div>
      </div>
    </>
  );
}
