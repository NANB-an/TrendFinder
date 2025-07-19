import { useCallback } from 'react'

export default function useGenerateIdea(supabase, navigate) {
  return useCallback(async (title) => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      navigate('/login')
      return null
    }

    const res = await fetch('http://127.0.0.1:8000/api/generate_idea/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ title }),
    })

    const data = await res.json()
    console.log('Generated idea:', data)
    return data.idea
  }, [supabase, navigate])
}
