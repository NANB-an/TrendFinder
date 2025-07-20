import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useNavigate } from 'react-router-dom'
import SignOut from '../components/SignOut'
import useGenerateIdea from '../utils/generateIdea'
import { supabase } from '../supabaseClient.js'
import Header from '../components/Header'
import { API_BASE_URL } from './config';



export default function Home() {
  const [subreddit, setSubreddit] = useState('')
  const [posts, setPosts] = useState([])
  const navigate = useNavigate()
  const generateIdea = useGenerateIdea(supabase, navigate)

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) navigate('/login')
    }
    checkSession()
  }, [navigate])

  const handleSignedOut = () => navigate('/login')

  const handleFetchTrending = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      navigate('/login')
      return
    }

    const url = subreddit.trim()
      ? `${API_BASE_URL}trending/?subreddit=${subreddit.trim()}`
      : `${API_BASE_URL}trending/`

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })

    const json = await res.json()
    console.log('Trending:', json)
    setPosts(json.posts || [])
  }

  const handleGenerateIdea = async (idx, title) => {
    const idea = await generateIdea(title)
    if (!idea) return
    const updated = [...posts]
    updated[idx].idea = idea
    setPosts(updated)
  }

  const handleToggleBookmark = async (idx, post) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      navigate('/login')
      return
    }

    if (post.isBookmarked && post.bookmark_id) {
      const res = await fetch(
        `${API_BASE_URL}bookmark/${post.bookmark_id}/`,
        { method: 'DELETE', headers: { Authorization: `Bearer ${session.access_token}` } }
      )
      const data = await res.json()
      console.log('Unbookmark:', data)
      const updated = [...posts]
      updated[idx].isBookmarked = false
      updated[idx].bookmark_id = null
      setPosts(updated)
    } else {
      const res = await fetch(
        `${API_BASE_URL}bookmark/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            title: post.title,
            subreddit: post.subreddit,
            url: post.url,
            idea: post.idea,
          }),
        }
      )
      const data = await res.json()
      console.log('Bookmark:', data)
      if (data.id) {
        const updated = [...posts]
        updated[idx].isBookmarked = true
        updated[idx].bookmark_id = data.id
        setPosts(updated)
      }
    }
  }

  return (
    <div className="p-4">
        <Header onSignOut={handleSignedOut} />
      <h1>Reddit Trends</h1>
      

      <div className="mt-4">
        <input
          placeholder="Subreddit (optional)"
          value={subreddit}
          onChange={e => setSubreddit(e.target.value)}
          className="border p-2"
        />
        <button onClick={handleFetchTrending} className="ml-2 p-2 bg-blue-500 text-white">
          Fetch Trending
        </button>
      </div>

      <ul className="mt-4">
        {posts.map((post, idx) => (
          <li key={idx} className="mb-4 border-b pb-2">
            <a href={post.url} target="_blank" rel="noreferrer">{post.title}</a>
            <p>gemini suggest: {post.idea || 'No idea generated yet.'}</p>
            <p>r/{post.subreddit} | Score: {post.score}</p>

            <button
              onClick={() => handleGenerateIdea(idx, post.title)}
              className="mt-2 mr-2 px-2 py-1 bg-purple-500 text-white rounded"
            >
              Generate Idea
            </button>

            <button
              onClick={() => handleToggleBookmark(idx, post)}
              className={`mt-2 px-2 py-1 rounded ${post.isBookmarked ? 'bg-red-500' : 'bg-green-500'} text-white`}
            >
              {post.isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
