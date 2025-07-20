
import { supabase } from '../supabaseClient.js'



export default function Login() {
  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
    if (error) console.error(error)
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Sign in</h1>
      <button
        onClick={handleSignIn}
        className="px-4 py-2 bg-blue-600 text-white"
      >
        Sign in with Google
      </button>
    </div>
  )
}
