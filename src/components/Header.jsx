// src/components/Header.jsx
import { Link, useLocation } from 'react-router-dom'
import GlassSurface from '../components/GlassSurface'
import '../styles/Header.css'
import { useState, useEffect } from 'react'

export default function Header({ onSignOut }) {
  const location = useLocation()
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const isHome = location.pathname === '/'
  const isBookmarks = location.pathname === '/bookmarks'

  return (
    <header className="header">
      <GlassSurface
        displace={15}
        width={20000}
        distortionScale={-150}
        redOffset={5}
        greenOffset={15}
        blueOffset={25}
        brightness={60}
        opacity={0.8}
        mixBlendMode="screen"
        className="glass-surface"
        
      >
        <nav className="nav-links">
          {!isHome && (
            <Link to="/">Home</Link>
          )}
          {!isBookmarks && (
            <Link to="/bookmarks">Bookmarks</Link>
          )}
        </nav>
        <button onClick={onSignOut} className="sign-out-btn">
          Sign Out
        </button>
        
      </GlassSurface>
    </header>
  )
}
