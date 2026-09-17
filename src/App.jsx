import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FavoritesProvider } from "./FavoritesContext";
import Navbar from "./Navbar";
import Home from "./Home";
import Search from "./Search";
import Favorites from "./Favorites";
import Compare from "./Compare";

function load(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function App() {
  const [theme, setTheme] = useState(() => load("uni-theme", "light"));

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("uni-theme", JSON.stringify(theme));
  }, [theme]);

  return (
    <FavoritesProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar theme={theme} setTheme={setTheme} />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/compare" element={<Compare />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </FavoritesProvider>
  );
}

export default App;
