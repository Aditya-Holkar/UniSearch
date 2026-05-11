import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { FavoritesProvider } from './FavoritesContext'
import Navbar from './Navbar'
import Home from './Home'
import Search from './Search'
import Favorites from './Favorites'
import PageViews from './PageViews'

function load (key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback))
  } catch {
    return fallback
  }
}

function App () {
  const [theme, setTheme] = useState(() => load('uni-theme', 'light'))

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('uni-theme', JSON.stringify(theme))
  }, [theme])

  return (
    <FavoritesProvider>
      <BrowserRouter>
        <div className='min-h-screen flex flex-col'>
          <Navbar theme={theme} setTheme={setTheme} />
          <main className='flex-1'>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/search' element={<Search />} />
              <Route path='/favorites' element={<Favorites />} />
            </Routes>
            {/* <div className="flex justify-center pb-4 px-4">
              <PageViews className="w-full max-w-md" />
            </div> */}
          </main>
        </div>
      </BrowserRouter>
    </FavoritesProvider>
  )
}

export default App
