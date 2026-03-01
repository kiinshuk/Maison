import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';

function useInView(ref, options = {}) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); observer.disconnect(); }
    }, { threshold: 0.15, ...options });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return inView;
}

const HERO_SLIDES = [
  {
    img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1800&auto=format&fit=crop&q=85',
    label: 'New Collection 2026',
    title: 'Artful Living,\nCurated for You',
    sub: 'Discover pieces that transform your home into a sanctuary of beauty and calm.',
    cta: 'Explore Collection',
    link: '/collections',
  },
  {
    img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1800&auto=format&fit=crop&q=85',
    label: 'Bedroom Essentials',
    title: 'Rest in\nRefined Comfort',
    sub: 'Premium linens, timeless furniture and soft lighting for restful nights.',
    cta: 'Shop Bedroom',
    link: '/collections?category=bedroom',
  },
  {
    img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1800&auto=format&fit=crop&q=85',
    label: 'Kitchen & Dining',
    title: 'Set the\nPerfect Table',
    sub: 'Handcrafted ceramics and natural wood pieces for memorable dining.',
    cta: 'Shop Kitchen',
    link: '/collections?category=kitchen-dining',
  },
];

const CATEGORY_GRID = [
  { name: 'Living Room', slug: 'living-room', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700&auto=format&fit=crop', span: 'md:col-span-2 md:row-span-2' },
  { name: 'Wall Art', slug: 'wall-art', img: 'https://images.unsplash.com/photo-1579541591970-288a6090bf24?w=700&auto=format&fit=crop', span: '' },
  { name: 'Lighting', slug: 'lighting', img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=700&auto=format&fit=crop', span: '' },
  { name: 'Bedroom', slug: 'bedroom', img: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=700&auto=format&fit=crop', span: '' },
  { name: 'Plants & Planters', slug: 'plants-planters', img: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=700&auto=format&fit=crop', span: '' },
];

function HeroSlider() {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState(null);
  const [dir, setDir] = useState(1);
  const timerRef = useRef(null);

  const goTo = (idx, direction = 1) => {
    setPrev(active);
    setDir(direction);
    setActive(idx);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => goTo((active + 1) % HERO_SLIDES.length, 1), 6000);
    return () => clearInterval(timerRef.current);
  }, [active]);

  const slide = HERO_SLIDES[active];

  return (
    <section className="relative h-[92vh] min-h-[560px] overflow-hidden bg-espresso">
      {HERO_SLIDES.map((s, i) => (
        <div key={i} className={`absolute inset-0 transition-all duration-800 ease-expo ${i === active ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}>
          <img src={s.img} alt={s.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/70 via-charcoal/30 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
          <div key={active} className="max-w-xl">
            <p className="section-label text-cream/70 animate-fadeUp mb-4">{slide.label}</p>
            <h1 className="font-serif text-5xl md:text-7xl font-light text-cream leading-[1.1] whitespace-pre-line animate-fadeUp delay-100 mb-6">
              {slide.title}
            </h1>
            <p className="text-cream/70 text-sm leading-relaxed animate-fadeUp delay-200 mb-10 max-w-sm">{slide.sub}</p>
            <div className="flex items-center gap-6 animate-fadeUp delay-300">
              <Link to={slide.link} className="btn-primary bg-white text-charcoal hover:bg-cream border-0">
                {slide.cta}
              </Link>
              <Link to="/collections" className="text-cream/80 text-2xs tracking-widest2 uppercase flex items-center gap-2 hover:gap-3 transition-all duration-200 hover:text-cream">
                View All <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Slide controls */}
      <div className="absolute bottom-8 right-8 md:right-12 z-10 flex items-center gap-4">
        <button onClick={() => goTo((active - 1 + HERO_SLIDES.length) % HERO_SLIDES.length, -1)}
          className="w-10 h-10 border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
          <ChevronLeft size={18} strokeWidth={1.5} />
        </button>
        <div className="flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => goTo(i, i > active ? 1 : -1)}
              className={`transition-all duration-400 rounded-full ${i === active ? 'w-8 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'}`} />
          ))}
        </div>
        <button onClick={() => goTo((active + 1) % HERO_SLIDES.length, 1)}
          className="w-10 h-10 border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
          <ChevronRight size={18} strokeWidth={1.5} />
        </button>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/40">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-white/40 animate-pulse" />
        <span className="text-2xs tracking-widest uppercase rotate-0">Scroll</span>
      </div>
    </section>
  );
}

function SectionWrapper({ children, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref);
  return (
    <div ref={ref} className={`${inView ? 'opacity-100' : 'opacity-0'} transition-all duration-700 ease-expo ${className}`}>
      {children}
    </div>
  );
}

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    API.get('/products/?featured=true').then(r => setFeatured(r.data.results || r.data));
    API.get('/categories/').then(r => setCategories(r.data.results || r.data));
    API.get('/products/?sort=newest').then(r => setNewArrivals((r.data.results || r.data).slice(0, 4)));
  }, []);

  return (
    <div className="bg-cream">
      <HeroSlider />

      {/* Brand strip */}
      <div className="border-y border-mink bg-sand py-5">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex flex-wrap items-center justify-center gap-x-12 gap-y-3 text-2xs tracking-widest2 uppercase text-mocha font-medium">
          {['Free Shipping $150+', '30-Day Returns', 'Sustainably Sourced', 'Expert Curation', 'Secure Checkout'].map(t => (
            <span key={t} className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-gold inline-block" />{t}</span>
          ))}
        </div>
      </div>

      {/* Category editorial grid */}
      <SectionWrapper>
        <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="section-label mb-3">Shop by Room</p>
              <h2 className="font-serif text-4xl md:text-5xl font-light text-charcoal">Find Your Style</h2>
            </div>
            <Link to="/collections" className="btn-ghost hidden md:flex">
              All Rooms <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-3 h-auto md:h-[600px]">
            {CATEGORY_GRID.map((cat, i) => (
              <Link key={cat.slug} to={`/collections?category=${cat.slug}`}
                className={`group relative overflow-hidden bg-sand ${cat.span}`}
                style={{ animationDelay: `${i * 80}ms` }}>
                <img src={cat.img} alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-expo min-h-[180px] md:min-h-0"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700'; }} />
                <div className="absolute inset-0 overlay-dark" />
                <div className="absolute bottom-0 left-0 p-5">
                  <p className="text-cream font-serif text-xl font-light mb-1">{cat.name}</p>
                  <p className="text-cream/60 text-2xs tracking-widest uppercase flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-300">
                    Shop Now <ArrowRight size={11} />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </SectionWrapper>

      {/* Featured products */}
      <SectionWrapper>
        <section className="bg-sand py-20">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="section-label mb-3">Curated Selection</p>
                <h2 className="font-serif text-4xl md:text-5xl font-light text-charcoal">Featured Pieces</h2>
              </div>
              <Link to="/collections?featured=true" className="btn-ghost hidden md:flex">
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
              {featured.slice(0, 8).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
            <div className="text-center mt-12">
              <Link to="/collections?featured=true" className="btn-outline">View All Featured</Link>
            </div>
          </div>
        </section>
      </SectionWrapper>

      {/* Editorial banner */}
      <SectionWrapper>
        <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden">
            <div className="relative h-80 md:h-[520px] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=900&auto=format&fit=crop" alt="editorial"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-expo" />
            </div>
            <div className="bg-espresso p-10 md:p-16 flex flex-col justify-center">
              <p className="section-label text-gold mb-5">Our Philosophy</p>
              <h2 className="font-serif text-3xl md:text-4xl font-light text-cream leading-snug mb-6">
                Beauty in Every Detail, Crafted to Last
              </h2>
              <div className="w-8 h-px bg-gold mb-6" />
              <p className="text-cream/60 text-sm leading-relaxed mb-8">
                We believe your home should tell your story. Every piece in our collection is chosen for its craftsmanship, sustainable origins, and timeless design that transcends trends.
              </p>
              <Link to="/collections" className="btn-primary bg-gold border-0 hover:bg-gold/90 self-start">
                Discover Our Story
              </Link>
            </div>
          </div>
        </section>
      </SectionWrapper>

      {/* New arrivals */}
      <SectionWrapper>
        <section className="bg-sand py-20">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="section-label mb-3">Just Landed</p>
                <h2 className="font-serif text-4xl md:text-5xl font-light text-charcoal">New Arrivals</h2>
              </div>
              <Link to="/collections?sort=newest" className="btn-ghost hidden md:flex">
                See All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
              {newArrivals.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        </section>
      </SectionWrapper>

      {/* Instagram-style mood grid */}
      <SectionWrapper>
        <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20">
          <div className="text-center mb-10">
            <p className="section-label mb-3">@maison_home</p>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-charcoal">Follow Our World</h2>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {[
              'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1571104508999-893933ded431?w=400&auto=format&fit=crop',
            ].map((src, i) => (
              <div key={i} className="group relative aspect-square overflow-hidden bg-sand cursor-pointer">
                <img src={src} alt="mood" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-expo" />
                <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/30 transition-all duration-400 flex items-center justify-center">
                  <span className="text-white text-2xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">Shop Look</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </SectionWrapper>
    </div>
  );
}
