import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.username, form.password);
      toast.success('Welcome back!');
      navigate('/');
    } catch {
      toast.error('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand flex">
      {/* Left image panel */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&auto=format&fit=crop&q=85"
          alt="interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/30 flex items-end p-16">
          <div>
            <p className="font-serif text-4xl font-light text-cream leading-snug mb-3">
              Beautiful spaces<br />begin here.
            </p>
            <p className="text-cream/60 text-sm">Curated home decor for modern living.</p>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-16 bg-cream">
        <div className="w-full max-w-sm animate-fadeUp">
          <Link to="/" className="block font-serif text-2xl tracking-[0.2em] text-charcoal mb-12 text-center">
            MAISON
          </Link>

          <p className="section-label text-center mb-3">Welcome Back</p>
          <h1 className="font-serif text-3xl font-light text-charcoal text-center mb-10">Sign In</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-2xs tracking-widest uppercase text-mocha block mb-2">Username</label>
              <input className="input" type="text" value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                placeholder="Your username" required autoFocus />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-2xs tracking-widest uppercase text-mocha">Password</label>
                <a href="#" className="text-2xs text-mocha hover:text-charcoal transition-colors">Forgot?</a>
              </div>
              <input className="input" type="password" value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Your password" required />
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary mt-2 py-4">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="relative my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-mink" />
            <span className="text-2xs tracking-widest text-taupe uppercase">or</span>
            <div className="flex-1 h-px bg-mink" />
          </div>

          <p className="text-center text-xs text-mocha">
            New to Maison?{' '}
            <Link to="/register" className="text-charcoal underline underline-offset-2 hover:text-mocha transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
