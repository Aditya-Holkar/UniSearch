/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react";

function favKey(params) {
  return `${params.name}||${params.country}`;
}

function load(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

const FavoritesContext = createContext(null);

export const APPLICATION_STATUSES = ["Researching", "Shortlisted", "Applying", "Applied"];

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    const data = load("uni-favorites", []);
    if (!Array.isArray(data)) return [];
    if (data.length > 0 && typeof data[0] === "string") return [];
    return data.map((item) => ({ ...item, status: item.status || "Researching", note: item.note || "" }));
  });

  useEffect(() => {
    localStorage.setItem("uni-favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFav = useCallback((params) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.id === favKey(params))) {
        return prev.filter((f) => f.id !== favKey(params));
      }
      return [...prev, {
        id: favKey(params),
        name: params.name,
        country: params.country,
        "state-province": params["state-province"],
        web_pages: params.web_pages,
        domains: params.domains,
        status: "Researching",
        note: "",
      }];
    });
  }, []);

  const updateFavorite = useCallback((id, changes) => {
    setFavorites((prev) => prev.map((item) => item.id === id ? { ...item, ...changes } : item));
  }, []);

  const isFavorite = useCallback((params) => {
    return favorites.some((f) => f.id === favKey(params));
  }, [favorites]);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFav, updateFavorite, isFavorite, favKey }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}

export { favKey };
