import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown, ChevronUp, LayoutGrid, LayoutList } from 'lucide-react';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest' },
  { value: 'price_asc',  label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Top Rated' },
  { value: 'name_asc',   label: 'Name A–Z' },
];

function FilterAccordion({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-mink py-4">
      <button onClick={() => setOpen(o => !o)} className="flex items-center justify-between w-full text-left">
        <span className="text-2xs font-medium tracking-widest2 uppercase text-charcoal">{title}</span>
        {open ? <ChevronUp size={14} className="text-taupe" /> : <ChevronDown size={14} className="text-taupe" />}
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-expo ${open ? 'max-h-96 mt-4' : 'max-h-0'}`}>
        {children}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="skeleton aspect-[3/4] mb-4" />
      <div className="space-y-2">
        <div className="skeleton h-2.5 w-1/3 rounded-full" />
        <div className="skeleton h-3.5 w-3/4 rounded-full" />
        <div className="skeleton h-3 w-1/4 rounded-full" />
      </div>
    </div>
  );
}

export default function Collections() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [total, setTotal]         = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cols, setCols]           = useState(4); // grid columns
  const topRef = useRef(null);

  const category  = searchParams.get('category') || '';
  const search    = searchParams.get('search')   || '';
  const sort      = searchParams.get('sort')     || 'newest';
  const minPrice  = searchParams.get('min_price')|| '';
  const maxPrice  = searchParams.get('max_price')|| '';
  const featured  = searchParams.get('featured') || '';

  useEffect(() => {
    API.get('/categories/').then(r => setCategories(r.data.results || r.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search)   params.set('search', search);
    if (sort)     params.set('sort', sort);
    if (minPrice) params.set('min_price', minPrice);
    if (maxPrice) params.set('max_price', maxPrice);
    if (featured) params.set('featured', featured);
    API.get(`/products/?${params}`)
      .then(r => { const d = r.data; setProducts(d.results||d); setTotal(d.count||(d.results||d).length); })
      .finally(() => setLoading(false));
  }, [category, search, sort, minPrice, maxPrice, featured]);

  const setParam = (key, value) => {
    const p = new URLSearchParams(searchParams);
    value ? p.set(key, value) : p.delete(key);
    setSearchParams(p);
  };

  const clearAll = () => setSearchParams({});

  const activeCategory = categories.find(c => c.slug === category);
  const hasFilters = !!(category || minPrice || maxPrice || featured || search);

  const PRICE_RANGES = [
    { label: 'Under $50',     min: '',   max: '50' },
    { label: '$50 – $100',    min: '50', max: '100' },
    { label: '$100 – $250',   min: '100',max: '250' },
    { label: '$250 – $500',   min: '250',max: '500' },
    { label: 'Over $500',     min: '500',max: '' },
  ];

  const FilterPanel = () => (
    <div className="space-y-0">
      {/* Category */}
      <FilterAccordion title="Category">
        <ul className="space-y-1">
          <li>
            <button onClick={() => setParam('category', '')}
              className={`w-full text-left text-xs py-1.5 transition-colors ${!category ? 'text-charcoal font-medium' : 'text-mocha hover:text-charcoal'}`}>
              All Products
            </button>
          </li>
          {categories.map(cat => (
            <li key={cat.slug}>
              <button onClick={() => setParam('category', cat.slug)}
                className={`w-full text-left text-xs py-1.5 flex justify-between items-center transition-colors ${category === cat.slug ? 'text-charcoal font-medium' : 'text-mocha hover:text-charcoal'}`}>
                <span>{cat.name}</span>
                <span className="text-taupe text-2xs">({cat.product_count})</span>
              </button>
            </li>
          ))}
        </ul>
      </FilterAccordion>

      {/* Price */}
      <FilterAccordion title="Price Range">
        <div className="space-y-1 mb-4">
          {PRICE_RANGES.map(r => {
            const active = minPrice === r.min && maxPrice === r.max;
            return (
              <button key={r.label} onClick={() => { setParam('min_price', r.min); setParam('max_price', r.max); }}
                className={`w-full text-left text-xs py-1.5 flex items-center gap-2 transition-colors ${active ? 'text-charcoal font-medium' : 'text-mocha hover:text-charcoal'}`}>
                <span className={`w-3 h-3 border rounded-sm flex-shrink-0 transition-colors ${active ? 'bg-charcoal border-charcoal' : 'border-taupe'}`} />
                {r.label}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <input type="number" placeholder="Min $" value={minPrice}
            onChange={e => setParam('min_price', e.target.value)}
            className="w-full border border-mink bg-transparent px-2 py-1.5 text-xs text-charcoal placeholder-taupe focus:outline-none focus:border-mocha transition-colors" />
          <span className="text-taupe">–</span>
          <input type="number" placeholder="Max $" value={maxPrice}
            onChange={e => setParam('max_price', e.target.value)}
            className="w-full border border-mink bg-transparent px-2 py-1.5 text-xs text-charcoal placeholder-taupe focus:outline-none focus:border-mocha transition-colors" />
        </div>
      </FilterAccordion>

      {/* Featured */}
      <FilterAccordion title="Availability" defaultOpen={false}>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-4 h-4 border flex-shrink-0 flex items-center justify-center transition-colors ${featured === 'true' ? 'bg-charcoal border-charcoal' : 'border-taupe group-hover:border-mocha'}`}
              onClick={() => setParam('featured', featured === 'true' ? '' : 'true')}>
              {featured === 'true' && <span className="text-white text-2xs">✓</span>}
            </div>
            <span className="text-xs text-mocha group-hover:text-charcoal transition-colors">Featured items only</span>
          </label>
        </div>
      </FilterAccordion>

      {/* Clear */}
      {hasFilters && (
        <button onClick={clearAll} className="flex items-center gap-1.5 text-2xs tracking-widest uppercase text-red-400 hover:text-red-600 transition-colors pt-4">
          <X size={12} /> Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div ref={topRef} className="min-h-screen bg-cream">
      {/* Page header */}
      <div className="border-b border-mink bg-sand">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10">
          <p className="section-label mb-3">
            {search ? 'Search Results' : activeCategory ? activeCategory.name : 'Collections'}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-charcoal">
            {search ? `"${search}"` : activeCategory ? activeCategory.name : 'All Products'}
          </h1>
          {activeCategory?.description && (
            <p className="text-sm text-mocha mt-3 max-w-xl">{activeCategory.description}</p>
          )}
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8 pb-5 border-b border-mink">
          <div className="flex items-center gap-4">
            {/* Mobile filter toggle */}
            <button onClick={() => setDrawerOpen(true)}
              className="lg:hidden flex items-center gap-2 text-2xs tracking-widest uppercase border border-mink px-4 py-2.5 hover:border-mocha transition-colors">
              <SlidersHorizontal size={13} strokeWidth={1.5} /> Filters
            </button>
            <p className="text-xs text-mocha">
              {loading ? '—' : `${total} product${total !== 1 ? 's' : ''}`}
            </p>
            {/* Active filter pills */}
            {hasFilters && (
              <div className="hidden md:flex items-center gap-2 flex-wrap">
                {category && (
                  <span className="flex items-center gap-1 bg-sand border border-mink text-2xs tracking-widest uppercase px-3 py-1.5 text-mocha">
                    {activeCategory?.name || category}
                    <button onClick={() => setParam('category', '')} className="ml-1 hover:text-charcoal"><X size={10} /></button>
                  </span>
                )}
                {(minPrice || maxPrice) && (
                  <span className="flex items-center gap-1 bg-sand border border-mink text-2xs tracking-widest uppercase px-3 py-1.5 text-mocha">
                    ${minPrice||'0'} – ${maxPrice||'∞'}
                    <button onClick={() => { setParam('min_price',''); setParam('max_price',''); }} className="ml-1 hover:text-charcoal"><X size={10} /></button>
                  </span>
                )}
                {featured && (
                  <span className="flex items-center gap-1 bg-sand border border-mink text-2xs tracking-widest uppercase px-3 py-1.5 text-mocha">
                    Featured <button onClick={() => setParam('featured','')} className="ml-1 hover:text-charcoal"><X size={10} /></button>
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Grid toggle */}
            <div className="hidden md:flex items-center gap-1">
              {[3,4].map(n => (
                <button key={n} onClick={() => setCols(n)}
                  className={`p-1.5 transition-colors ${cols === n ? 'text-charcoal' : 'text-taupe hover:text-mocha'}`}>
                  {n === 3 ? <LayoutList size={16} strokeWidth={1.5} /> : <LayoutGrid size={16} strokeWidth={1.5} />}
                </button>
              ))}
            </div>
            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-2xs tracking-widest uppercase text-mocha hidden sm:block">Sort:</span>
              <select value={sort} onChange={e => setParam('sort', e.target.value)}
                className="text-xs border-b border-mink bg-transparent text-charcoal py-1 pr-5 focus:outline-none focus:border-mocha cursor-pointer appearance-none">
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-10">
          {/* Sidebar — desktop */}
          <aside className="hidden lg:block w-52 flex-shrink-0">
            <FilterPanel />
          </aside>

          {/* Products */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className={`grid grid-cols-2 ${cols === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-x-5 gap-y-10`}>
                {Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-28">
                <p className="font-serif text-3xl font-light text-charcoal mb-3">No products found</p>
                <p className="text-sm text-mocha mb-8">Try adjusting your filters or browse all products</p>
                <button onClick={clearAll} className="btn-outline">Clear Filters</button>
              </div>
            ) : (
              <div className={`grid grid-cols-2 ${cols === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-x-5 gap-y-12`}>
                {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <div className={`fixed inset-0 z-[100] lg:hidden transition-all duration-400 ${drawerOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div className={`absolute inset-0 bg-charcoal/40 backdrop-blur-sm transition-opacity duration-400 ${drawerOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setDrawerOpen(false)} />
        <div className={`absolute right-0 top-0 bottom-0 w-80 bg-cream shadow-2xl transition-transform duration-500 ease-expo flex flex-col ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between px-6 h-14 border-b border-mink flex-shrink-0">
            <span className="text-2xs font-medium tracking-widest2 uppercase">Filters</span>
            <button onClick={() => setDrawerOpen(false)}><X size={18} strokeWidth={1.5} /></button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-2"><FilterPanel /></div>
          <div className="p-6 border-t border-mink flex-shrink-0">
            <button onClick={() => setDrawerOpen(false)} className="w-full btn-primary">
              View {total} Product{total !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
