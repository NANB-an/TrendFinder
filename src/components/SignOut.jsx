import { supabase } from '../supabaseClient.js';
import { useNavigate } from 'react-router-dom';

export default function SignOut({ onSignOut }) {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    // ✅ Paranoia: remove any possible leftover session keys
    localStorage.removeItem('supabase.auth.token');
    localStorage.removeItem('supabase.auth.refresh_token');
    localStorage.removeItem('supabase.auth.expires_at');

    if (error) {
      console.error('Error signing out:', error);
    } else {
      if (onSignOut) onSignOut();

      // ✅ Always force redirect to login page
      navigate('/login', { replace: true });
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="px-4 py-2 bg-red-600 text-white rounded"
    >
      Sign Out
    </button>
  );
}
