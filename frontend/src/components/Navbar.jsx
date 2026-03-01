import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const NAV_CATEGORIES = [
  { label: 'Living Room', slug: 'living-room' },
  { label: 'Bedroom', slug: 'bedroom' },
  { label: 'Kitchen & Dining', slug: 'kitchen-dining' },
  { label: 'Bathroom', slug: 'bathroom' },
  { label: 'Wall Art', slug: 'wall-art' },
  { label: 'Lighting', slug: 'lighting' },
  { label: 'Plants & Planters', slug: 'plants-planters' },
  { label: 'Cushions & Throws', slug: 'cushions-throws' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setShopOpen(false);
    setUserOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 100);
  }, [searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/collections?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-espresso text-cream text-2xs tracking-widest3 uppercase text-center py-2.5 font-medium">
        Complimentary shipping on orders over $150 &nbsp;·&nbsp; Use <span className="text-gold">MAISON10</span> for 10% off
      </div>

      {/* Main header */}
      <header className={`sticky top-0 z-50 transition-all duration-400 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-[0_1px_0_0_#e8e0d5]' : 'bg-cream'}`}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-[68px]">

            {/* Left — hamburger + Shop dropdown */}
            <div className="flex items-center gap-6">
              <button className="lg:hidden p-1 -ml-1" onClick={() => setMobileOpen(true)}>
                <Menu size={20} strokeWidth={1.5} />
              </button>
              <div className="hidden lg:flex items-center gap-8">
                {/* Shop dropdown */}
                <div className="relative" onMouseEnter={() => setShopOpen(true)} onMouseLeave={() => setShopOpen(false)}>
                  <button className="flex items-center gap-1 text-2xs font-medium tracking-widest2 uppercase text-charcoal hover:text-mocha transition-colors duration-200">
                    Shop <ChevronDown size={12} className={`transition-transform duration-300 ${shopOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`absolute top-full left-0 mt-2 w-52 bg-white shadow-xl border border-mink transition-all duration-300 origin-top ${shopOpen ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-95 pointer-events-none'}`}>
                    <div className="py-3">
                      <Link to="/collections" className="block px-5 py-2 text-2xs tracking-widest2 uppercase text-charcoal hover:bg-sand hover:text-mocha transition-colors duration-150 font-medium">
                        All Products
                      </Link>
                      <div className="my-2 border-t border-mink" />
                      {NAV_CATEGORIES.map(cat => (
                        <Link key={cat.slug} to={`/collections?category=${cat.slug}`}
                          className="block px-5 py-2 text-2xs tracking-widest uppercase text-mocha hover:bg-sand hover:text-charcoal transition-colors duration-150">
                          {cat.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                <Link to="/collections?featured=true" className="text-2xs font-medium tracking-widest2 uppercase text-charcoal hover:text-mocha transition-colors duration-200">Featured</Link>
                <Link to="/collections" className="text-2xs font-medium tracking-widest2 uppercase text-charcoal hover:text-mocha transition-colors duration-200">Sale</Link>
              </div>
            </div>

            {/* Center — Logo */}
            <Link to="/" className="absolute left-1/2 -translate-x-1/2 font-serif text-2xl font-light tracking-[0.2em] text-charcoal hover:text-mocha transition-colors duration-300">
              MAISON
            </Link>

            {/* Right — icons */}
            <div className="flex items-center gap-5">
              <button onClick={() => setSearchOpen(s => !s)} className="p-1 text-charcoal hover:text-mocha transition-colors duration-200">
                <Search size={18} strokeWidth={1.5} />
              </button>

              {/* User */}
              <div className="relative hidden sm:block">
                <button onClick={() => setUserOpen(s => !s)} className="p-1 text-charcoal hover:text-mocha transition-colors duration-200">
                  <User size={18} strokeWidth={1.5} />
                </button>
                {userOpen && (
                  <div className="absolute right-0 top-full mt-3 w-52 bg-white border border-mink shadow-xl animate-scaleIn origin-top-right">
                    {user ? (
                      <>
                        <div className="px-5 py-4 border-b border-mink">
                          <p className="text-2xs tracking-widest uppercase text-mocha">Signed in as</p>
                          <p className="text-sm font-medium text-charcoal mt-0.5">{user.first_name || user.username}</p>
                        </div>
                        <div className="py-2">
                          <Link to="/profile" onClick={() => setUserOpen(false)} className="block px-5 py-2.5 text-2xs tracking-widest uppercase hover:bg-sand transition-colors">My Account</Link>
                          <Link to="/orders" onClick={() => setUserOpen(false)} className="block px-5 py-2.5 text-2xs tracking-widest uppercase hover:bg-sand transition-colors">My Orders</Link>
                          <button onClick={() => { logout(); setUserOpen(false); }} className="w-full text-left px-5 py-2.5 text-2xs tracking-widest uppercase text-red-500 hover:bg-sand transition-colors">Sign Out</button>
                        </div>
                      </>
                    ) : (
                      <div className="py-2">
                        <Link to="/login" onClick={() => setUserOpen(false)} className="block px-5 py-2.5 text-2xs tracking-widest uppercase hover:bg-sand transition-colors">Sign In</Link>
                        <Link to="/register" onClick={() => setUserOpen(false)} className="block px-5 py-2.5 text-2xs tracking-widest uppercase hover:bg-sand transition-colors">Create Account</Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Cart */}
              <Link to="/cart" className="relative p-1 text-charcoal hover:text-mocha transition-colors duration-200">
                <ShoppingBag size={18} strokeWidth={1.5} />
                {cart.item_count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-espresso text-cream text-2xs w-4 h-4 rounded-full flex items-center justify-center font-medium leading-none animate-scaleIn">
                    {cart.item_count}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Search overlay */}
        <div className={`overflow-hidden transition-all duration-400 ease-expo border-t border-mink ${searchOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-4">
            <form onSubmit={handleSearch} className="flex items-center gap-4">
              <Search size={16} strokeWidth={1.5} className="text-taupe flex-shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search for products, rooms, styles..."
                className="flex-1 bg-transparent text-sm text-charcoal placeholder-taupe focus:outline-none"
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery('')} className="text-taupe hover:text-charcoal transition-colors">
                  <X size={16} />
                </button>
              )}
            </form>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-[100] lg:hidden transition-all duration-400 ${mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {/* Backdrop */}
        <div className={`absolute inset-0 bg-charcoal/40 backdrop-blur-sm transition-opacity duration-400 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setMobileOpen(false)} />
        {/* Drawer */}
        <div className={`absolute left-0 top-0 bottom-0 w-80 bg-cream shadow-2xl transition-transform duration-500 ease-expo flex flex-col ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between px-6 h-16 border-b border-mink">
            <span className="font-serif text-xl tracking-[0.15em]">MAISON</span>
            <button onClick={() => setMobileOpen(false)}><X size={20} strokeWidth={1.5} /></button>
          </div>
          <nav className="flex-1 overflow-y-auto py-6 px-6 space-y-1">
            <Link to="/collections" className="block py-3 text-2xs tracking-widest2 uppercase font-medium border-b border-mink/50 text-charcoal">All Products</Link>
            {NAV_CATEGORIES.map((cat, i) => (
              <Link key={cat.slug} to={`/collections?category=${cat.slug}`}
                className="block py-3 text-2xs tracking-widest uppercase text-mocha hover:text-charcoal transition-colors border-b border-mink/30">
                {cat.label}
              </Link>
            ))}
            <Link to="/collections?featured=true" className="block py-3 text-2xs tracking-widest uppercase text-mocha">Featured</Link>
          </nav>
          <div className="px-6 py-6 border-t border-mink space-y-3">
            {user ? (
              <>
                <Link to="/orders" onClick={() => setMobileOpen(false)} className="block text-2xs tracking-widest uppercase py-2">My Orders</Link>
                <button onClick={() => { logout(); setMobileOpen(false); }} className="block text-2xs tracking-widest uppercase py-2 text-red-500">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block btn-primary text-center">Sign In</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="block btn-outline text-center">Create Account</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
