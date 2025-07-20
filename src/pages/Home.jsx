import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useGenerateIdea from '../utils/generateIdea'
import { supabase } from '../supabaseClient.js'
import Header from '../components/Header'
import { API_BASE_URL } from '../config'
import '../styles/Home.css'
import Particles from '../components/Particles'
import GlassSurface from '../components/GlassSurface'
import Ballpit from '../components/Ballpit.jsx'
import DotGrid from '../components/DotGrid'

// ✅ Font Awesome imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark as solidBookmark } from '@fortawesome/free-solid-svg-icons'
import { faBookmark as regularBookmark } from '@fortawesome/free-regular-svg-icons'

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
      if (data.id) {
        const updated = [...posts]
        updated[idx].isBookmarked = true
        updated[idx].bookmark_id = data.id
        setPosts(updated)
      }
    }
  }

  return (
    <div className="home-page">
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
        <h1>Reddit Trends</h1>

        <div className="search-bar">
          <GlassSurface
            align="center"
            width="100%"
            height="auto"
            borderRadius={12}
            brightness={60}
            opacity={0.8}
            displace={15}
            distortionScale={-150}
            redOffset={5}
            greenOffset={15}
            blueOffset={25}
            mixBlendMode="screen"
            className="glass-surface"
          >
            <input
              placeholder="Subreddit (optional)"
              value={subreddit}
              onChange={e => setSubreddit(e.target.value)}
              style={{
                width: '80%',
                padding: '0.5rem 1rem',
                border: 'none',
                background: 'transparent',
                color: 'inherit',
                outline: 'none',
                fontSize: '1rem',
              }}
            />
          </GlassSurface>
          <button onClick={handleFetchTrending}>Fetch Trending</button>
        </div>

        <ul className="posts">
          {posts.map((post, idx) => (
            <li key={idx} className="post-card">
              <a href={post.url} target="_blank" rel="noreferrer">
                {post.title}
              </a>
              <p>Gemini Suggest: {post.idea || 'No idea generated yet.'}</p>
              <p>r/{post.subreddit} | Score: {post.score}</p>

              <div className="post-actions">
                <button onClick={() => handleGenerateIdea(idx, post.title)}>
                  Generate Idea
                </button>
                <button
                  onClick={() => handleToggleBookmark(idx, post)}
                  className="bookmark-btn"
                  title={post.isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
                >
                  <FontAwesomeIcon
                    icon={post.isBookmarked ? solidBookmark : regularBookmark}
                  />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
