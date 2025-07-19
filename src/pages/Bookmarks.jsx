import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useNavigate } from 'react-router-dom'
import SignOut from '../components/SignOut'
import useGenerateIdea from '../utils/generateIdea'
import { supabase } from '../supabaseClient.js'
import Header from '../components/Header'

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

      const res = await fetch('http://127.0.0.1:8000/api/get_bookmarks/', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })

      const json = await res.json()
      console.log('Bookmarks:', json)
      setBookmarks(json.bookmarks || [])
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

    const res = await fetch(
      `http://127.0.0.1:8000/api/bookmark/${bookmark.id}/`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ idea }),
      }
    )

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

    const res = await fetch(
      `http://127.0.0.1:8000/api/bookmark/${bookmark.id}/`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.access_token}` },
      }
    )

    const data = await res.json()
    console.log('Delete:', data)
    if (res.ok) {
      setBookmarks(prev => prev.filter(b => b.id !== bookmark.id))
    }
  }

  return (
    
    <div className="p-4">
        <Header onSignOut={handleSignedOut} />
      <h1>Your Bookmarks</h1>
      

      <ul className="mt-4">
        {bookmarks.length === 0 && <p>No bookmarks yet.</p>}
        {bookmarks.map((bookmark, idx) => (
          <li key={bookmark.id} className="mb-4 border-b pb-2">
            <a href={bookmark.url} target="_blank" rel="noreferrer">{bookmark.title}</a>
            <p>r/{bookmark.subreddit}</p>
            <p>gemini suggest: {bookmark.idea || 'No idea generated yet.'}</p>

            <button
              onClick={() => handleGenerateIdea(idx, bookmark)}
              className="mt-2 mr-2 px-2 py-1 bg-purple-500 text-white rounded"
            >
              Generate Idea
            </button>

            <button
              onClick={() => handleDelete(bookmark)}
              className="mt-2 px-2 py-1 bg-red-500 text-white rounded"
            >
              Remove Bookmark
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
