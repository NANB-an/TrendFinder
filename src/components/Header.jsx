// src/components/Header.jsx
import { Link, useLocation } from 'react-router-dom'

export default function Header({ onSignOut }) {
  const location = useLocation()

  const isHome = location.pathname === '/'
  const isBookmarks = location.pathname === '/bookmarks'

  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <div className="flex space-x-4">
        {!isHome && (
          <Link to="/" className="hover:underline">
            Home
          </Link>
        )}
        {!isBookmarks && (
          <Link to="/bookmarks" className="hover:underline">
            Bookmarks
          </Link>
        )}
      </div>
      <button
        onClick={onSignOut}
        className="px-3 py-1 bg-red-500 rounded hover:bg-red-600"
      >
        Sign Out
      </button>
    </header>
  )
}
