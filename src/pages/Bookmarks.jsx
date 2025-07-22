import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient.js'
import useGenerateIdea from '../utils/generateIdea'
import Header from '../components/Header'

import Particles from '../components/Particles'
import { API_BASE_URL } from '../config'
import '../styles/Bookmarks.css'

// Font Awesome imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark as solidBookmark } from '@fortawesome/free-solid-svg-icons'
import { faBookmark as regularBookmark } from '@fortawesome/free-regular-svg-icons'

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([])
  const navigate = useNavigate()
  const generateIdea = useGenerateIdea(supabase, navigate)

  useEffect(() => {
    const checkSessionAndFetch = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/login')
        return
      }

      const res = await fetch(`${API_BASE_URL}get_bookmarks/`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })

      const json = await res.json()
      console.log('Bookmarks:', json)
      const bookmarksWithFlag = (json.bookmarks || []).map(b => ({ ...b, isBookmarked: true }))
      setBookmarks(bookmarksWithFlag)
    }

    checkSessionAndFetch()
  }, [navigate])

  const handleSignedOut = () => navigate('/login')

  const handleGenerateIdea = async (idx, bookmark) => {
    const idea = await generateIdea(bookmark.title)
    if (!idea) return

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      navigate('/login')
      return
    }

    const res = await fetch(`${API_BASE_URL}bookmark/${bookmark.id}/update/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ idea }),
    })

    const data = await res.json()
    console.log('Updated:', data)

    const updated = [...bookmarks]
    updated[idx].idea = idea
    setBookmarks(updated)
  }

  const handleDelete = async (bookmark) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      navigate('/login')
      return
    }

    const res = await fetch(`${API_BASE_URL}bookmark/${bookmark.id}/`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${session.access_token}` },
    })

    const data = await res.json()
    console.log('Delete:', data)
    if (res.ok) {
      setBookmarks(prev => prev.filter(b => b.id !== bookmark.id))
    }
  }

  return (
    <div className="bookmarks-page">
      <div className="particles-wrap">
        <Particles
          particleColors={['#ffffff', '#ffffff']}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      <Header onSignOut={handleSignedOut} />

      <div className="container">
        <h1>Your Bookmarks</h1>

        {bookmarks.length === 0 && <p>No bookmarks yet.</p>}

        <ul className="posts">
          {bookmarks.map((bookmark, idx) => (
            <li key={bookmark.id} className="post-card">
              <a href={bookmark.url} target="_blank" rel="noreferrer">
                {bookmark.title}
              </a>
              <p>r/{bookmark.subreddit}</p>
              <p>Gemini Suggest: {bookmark.idea || 'No idea generated yet.'}</p>

              <div className="post-actions">
                <button onClick={() => handleGenerateIdea(idx, bookmark)}>Generate Idea</button>

                {/* Remove Bookmark icon button */}
                <button
                  onClick={() => handleDelete(bookmark)}
                  className="bookmark-btn"
                  title="Remove Bookmark"
                >
                  <FontAwesomeIcon icon={solidBookmark} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
