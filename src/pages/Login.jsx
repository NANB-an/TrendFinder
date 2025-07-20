import { supabase } from '../supabaseClient.js';
import '../styles/Login.css';
import GlassSurface from '../components/GlassSurface';
import Particles from '../components/Particles';

export default function Login() {
  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) console.error(error);
  };

  return (
    <div className="login-page">
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

      <h1>TrendFinder</h1>

      <GlassSurface
        onClick={handleSignIn}
        align="center"
        width="15%"
        borderRadius={12}
        brightness={60}
        opacity={0.8}
        displace={15}
        distortionScale={-150}
        redOffset={5}
        greenOffset={15}
        blueOffset={25}
        mixBlendMode="screen"
        className="login-button"
      >
        Sign in with Google
      </GlassSurface>
    </div>
  );
}
