import { createClient } from '@supabase/supabase-js'
import { supabase } from '../supabaseClient.js'


export default function SignOut({ onSignOut }) {
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
    } else {
      if (onSignOut) onSignOut()
    }
  }

  return (
    <button
      onClick={handleSignOut}
      className="px-4 py-2 bg-red-600 text-white rounded"
    >
      Sign Out
    </button>
  )
}
