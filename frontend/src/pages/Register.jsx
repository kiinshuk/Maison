import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', first_name: '', last_name: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Welcome to Maison!');
      navigate('/');
    } catch (err) {
      const errors = err.response?.data;
      const msg = errors ? Object.values(errors).flat().join(' ') : 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand flex">
      {/* Left image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&auto=format&fit=crop&q=85"
          alt="interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/30 flex items-end p-16">
          <div>
            <p className="font-serif text-4xl font-light text-cream leading-snug mb-3">
              Join the Maison<br />community.
            </p>
            <p className="text-cream/60 text-sm">Get exclusive access to new arrivals and member offers.</p>
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-16 bg-cream overflow-y-auto">
        <div className="w-full max-w-sm animate-fadeUp">
          <Link to="/" className="block font-serif text-2xl tracking-[0.2em] text-charcoal mb-12 text-center">
            MAISON
          </Link>

          <p className="section-label text-center mb-3">Join Us</p>
          <h1 className="font-serif text-3xl font-light text-charcoal text-center mb-10">Create Account</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="first_name" className="text-2xs tracking-widest uppercase text-mocha block mb-2">First Name</label>
              <input id="first_name" className="input" value={form.first_name}
                onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))}
                placeholder="Jane" />
            </div>
            <div>
              <label htmlFor="last_name" className="text-2xs tracking-widest uppercase text-mocha block mb-2">Last Name</label>
              <input id="last_name" className="input" value={form.last_name}
                onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))}
                placeholder="Smith" />
            </div>
            <div>
              <label htmlFor="username" className="text-2xs tracking-widest uppercase text-mocha block mb-2">Username</label>
              <input id="username" className="input" value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                placeholder="janesmith" required />
            </div>
            <div>
              <label htmlFor="email" className="text-2xs tracking-widest uppercase text-mocha block mb-2">Email</label>
              <input id="email" className="input" type="email" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="jane@example.com" required />
            </div>
            <div>
              <label htmlFor="password" className="text-2xs tracking-widest uppercase text-mocha block mb-2">Password</label>
              <input id="password" className="input" type="password" value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Min. 8 characters" required minLength={8} />
            </div>
              <div>
                <label className="text-2xs tracking-widest uppercase text-mocha block mb-2">Last Name</label>
                <input className="input" value={form.last_name}
                  onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))}
                  placeholder="Smith" />
              </div>
            </div>
            <div>
              <label className="text-2xs tracking-widest uppercase text-mocha block mb-2">Username</label>
              <input className="input" value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                placeholder="janesmith" required />
            </div>
            <div>
              <label className="text-2xs tracking-widest uppercase text-mocha block mb-2">Email</label>
              <input className="input" type="email" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="jane@example.com" required />
            </div>
            <div>
              <label className="text-2xs tracking-widest uppercase text-mocha block mb-2">Password</label>
              <input className="input" type="password" value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Min. 8 characters" required minLength={8} />
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary py-4 mt-2">
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-xs text-mocha mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-charcoal underline underline-offset-2 hover:text-mocha transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
