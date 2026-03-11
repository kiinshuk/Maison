import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingBag, Heart, Minus, Plus, ArrowRight, Truck, RotateCcw, Shield } from 'lucide-react';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [wished, setWished] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    Promise.all([
      API.get(`/products/${slug}/`).catch(() => ({ data: null })),
      API.get(`/products/${slug}/reviews/`).catch(() => ({ data: [] })),
    ]).then(([pr, rr]) => {
      if (!pr.data) {
        window.location.href = '/collections';
        return;
      }
      setProduct(pr.data);
      setReviews(rr.data);
      // fetch related
      API.get(`/products/?category=${pr.data.category_slug}`).then(res => {
        const all = res.data.results || res.data;
        setRelated(all.filter(p => p.slug !== slug).slice(0, 4));
      }).catch(() => setRelated([]));
    }).finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = async () => {
    if (!user) { toast.error('Please sign in to add to cart'); return; }
    setAdding(true);
    try {
      await addToCart(product.id, quantity);
      toast.success('Added to bag!');
    } catch { toast.error('Failed to add to bag'); }
    finally { setAdding(false); }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please sign in to leave a review'); return; }
    try {
      await API.post(`/products/${slug}/add_review/`, reviewForm);
      toast.success('Review submitted!');
      const rr = await API.get(`/products/${slug}/reviews/`);
      setReviews(rr.data);
      setReviewForm({ rating: 5, comment: '' });
    } catch { toast.error('Failed to submit review'); }
  };

  if (loading) return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="skeleton aspect-[4/5]" />
        <div className="space-y-5 pt-4">
          <div className="skeleton h-3 w-1/4 rounded-full" />
          <div className="skeleton h-8 w-3/4 rounded" />
          <div className="skeleton h-6 w-1/5 rounded" />
          <div className="skeleton h-24 rounded" />
          <div className="skeleton h-12 w-full rounded" />
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="text-center py-32">
      <p className="font-serif text-3xl font-light text-charcoal mb-4">Product not found</p>
      <Link to="/collections" className="btn-outline">Back to Collections</Link>
    </div>
  );

  const imgSrc = product.image || product.image_url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&auto=format&fit=crop';

  return (
    <div className="bg-cream">
      {/* Breadcrumb */}
      <div className="border-b border-mink bg-sand">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-4">
          <nav className="flex items-center gap-2 text-2xs tracking-widest uppercase text-mocha">
            <Link to="/" className="hover:text-charcoal transition-colors">Home</Link>
            <span className="text-taupe">/</span>
            <Link to="/collections" className="hover:text-charcoal transition-colors">Collections</Link>
            <span className="text-taupe">/</span>
            <Link to={`/collections?category=${product.category_slug}`} className="hover:text-charcoal transition-colors">{product.category_name}</Link>
            <span className="text-taupe">/</span>
            <span className="text-charcoal truncate max-w-xs">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main product section */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          {/* Image */}
          <div className="relative animate-fadeIn">
            <div className="relative overflow-hidden bg-sand aspect-[4/5]">
              <img src={imgSrc} alt={product.name}
                className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-700 ease-expo"
                onError={e => { e.target.src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900'; }} />
              {product.discount_percentage > 0 && (
                <span className="absolute top-5 left-5 tag bg-espresso text-cream">−{product.discount_percentage}%</span>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="animate-fadeUp lg:pt-4">
            <p className="section-label mb-3">{product.category_name}</p>
            <h1 className="font-serif text-3xl md:text-4xl font-light text-charcoal leading-snug mb-4">{product.name}</h1>

            {/* Rating */}
            {product.review_count > 0 && (
              <div className="flex items-center gap-2 mb-5">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={13} strokeWidth={1}
                      fill={s <= Math.round(Number(product.rating)) ? '#b8965a' : 'none'}
                      stroke={s <= Math.round(Number(product.rating)) ? '#b8965a' : '#c4b8a8'} />
                  ))}
                </div>
                <span className="text-xs text-mocha">{parseFloat(product.rating).toFixed(1)} ({product.review_count} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-mink">
              <span className="font-serif text-3xl font-light text-charcoal">${parseFloat(product.price).toFixed(2)}</span>
              {product.compare_price && parseFloat(product.compare_price) > parseFloat(product.price) && (
                <span className="text-sm text-taupe line-through">${parseFloat(product.compare_price).toFixed(2)}</span>
              )}
              {product.discount_percentage > 0 && (
                <span className="text-xs text-gold font-medium">Save {product.discount_percentage}%</span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-mocha leading-relaxed mb-7">{product.description}</p>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`w-2 h-2 rounded-full ${product.stock > 5 ? 'bg-green-400' : product.stock > 0 ? 'bg-amber-400' : 'bg-red-400'}`} />
              <span className="text-2xs tracking-widest uppercase text-mocha">
                {product.stock === 0 ? 'Out of Stock' : product.stock <= 5 ? `Only ${product.stock} left` : 'In Stock'}
              </span>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-5 mb-6">
              <span className="text-2xs tracking-widest uppercase text-mocha w-20">Quantity</span>
              <div className="flex items-center border border-mink">
                <button onClick={() => setQuantity(q => Math.max(1, q-1))}
                  className="w-10 h-10 flex items-center justify-center text-mocha hover:bg-sand transition-colors">
                  <Minus size={13} strokeWidth={1.5} />
                </button>
                <span className="w-10 text-center text-sm font-medium text-charcoal">{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock, q+1))}
                  className="w-10 h-10 flex items-center justify-center text-mocha hover:bg-sand transition-colors">
                  <Plus size={13} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <button onClick={handleAddToCart} disabled={adding || product.stock === 0}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                <ShoppingBag size={15} strokeWidth={1.5} />
                {product.stock === 0 ? 'Sold Out' : adding ? 'Adding…' : 'Add to Bag'}
              </button>
              <button onClick={() => setWished(w => !w)}
                className={`w-12 h-12 border flex items-center justify-center transition-all duration-200 ${wished ? 'border-gold bg-gold/10' : 'border-mink hover:border-mocha'}`}>
                <Heart size={16} strokeWidth={1.5}
                  fill={wished ? '#b8965a' : 'none'} stroke={wished ? '#b8965a' : '#8c7b6b'} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 py-6 border-t border-mink">
              {[
                { Icon: Truck, text: 'Free Shipping', sub: 'On orders $150+' },
                { Icon: RotateCcw, text: 'Free Returns', sub: '30-day policy' },
                { Icon: Shield, text: 'Secure Payment', sub: '100% safe' },
              ].map(({ Icon, text, sub }) => (
                <div key={text} className="text-center">
                  <Icon size={18} strokeWidth={1.2} className="mx-auto text-mocha mb-1.5" />
                  <p className="text-2xs font-medium text-charcoal">{text}</p>
                  <p className="text-2xs text-taupe">{sub}</p>
                </div>
              ))}
            </div>

            {/* Meta */}
            <div className="space-y-1.5 pt-4 border-t border-mink text-2xs text-mocha">
              <p><span className="text-charcoal font-medium">SKU:</span> HD-{String(product.id).padStart(5,'0')}</p>
              <p><span className="text-charcoal font-medium">Category:</span> {product.category_name}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-20 border-t border-mink">
          <div className="flex gap-8 pt-0">
            {['description','reviews'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`text-2xs tracking-widest2 uppercase py-5 border-b-[1.5px] transition-colors duration-200 ${activeTab === tab ? 'border-charcoal text-charcoal font-medium' : 'border-transparent text-mocha hover:text-charcoal'}`}>
                {tab === 'reviews' ? `Reviews (${reviews.length})` : 'Description'}
              </button>
            ))}
          </div>

          <div className="py-10">
            {activeTab === 'description' ? (
              <div className="max-w-2xl">
                <p className="text-sm text-mocha leading-relaxed">{product.description}</p>
                <div className="mt-8 grid grid-cols-2 gap-4">
                  {[['Material','Premium quality','Dimensions','Varies by item'],['Care','See product label','Origin','Sustainably sourced']].map(([k1,v1,k2,v2],i) => (
                    <div key={i} className="space-y-3">
                      <div><p className="text-2xs tracking-widest uppercase text-mocha mb-1">{k1}</p><p className="text-xs text-charcoal">{v1}</p></div>
                      <div><p className="text-2xs tracking-widest uppercase text-mocha mb-1">{k2}</p><p className="text-xs text-charcoal">{v2}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="space-y-6">
                  {reviews.length === 0 ? (
                    <p className="text-sm text-mocha">No reviews yet. Be the first!</p>
                  ) : reviews.map(r => (
                    <div key={r.id} className="pb-6 border-b border-mink last:border-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-sand border border-mink rounded-full flex items-center justify-center text-xs font-medium text-mocha">
                            {r.username[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-charcoal">{r.username}</p>
                            <div className="flex gap-0.5 mt-0.5">
                              {[1,2,3,4,5].map(s => <Star key={s} size={10} strokeWidth={1} fill={s<=r.rating?'#b8965a':'none'} stroke={s<=r.rating?'#b8965a':'#c4b8a8'} />)}
                            </div>
                          </div>
                        </div>
                        <span className="text-2xs text-taupe">{new Date(r.created_at).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</span>
                      </div>
                      <p className="text-xs text-mocha leading-relaxed">{r.comment}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="font-serif text-xl font-light text-charcoal mb-6">Write a Review</h3>
                  {user ? (
                    <form onSubmit={handleReviewSubmit} className="space-y-5">
                      <div>
                        <label className="text-2xs tracking-widest uppercase text-mocha block mb-2">Your Rating</label>
                        <div className="flex gap-1.5">
                          {[1,2,3,4,5].map(s => (
                            <button type="button" key={s} onClick={() => setReviewForm(f=>({...f,rating:s}))}>
                              <Star size={22} strokeWidth={1} fill={s<=reviewForm.rating?'#b8965a':'none'} stroke={s<=reviewForm.rating?'#b8965a':'#c4b8a8'} className="hover:scale-110 transition-transform" />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-2xs tracking-widest uppercase text-mocha block mb-2">Your Review</label>
                        <textarea rows={4} value={reviewForm.comment} onChange={e=>setReviewForm(f=>({...f,comment:e.target.value}))}
                          className="w-full border border-mink bg-transparent px-4 py-3 text-sm text-charcoal placeholder-taupe focus:outline-none focus:border-mocha resize-none transition-colors"
                          placeholder="Share your experience with this product..." required />
                      </div>
                      <button type="submit" className="btn-primary">Submit Review</button>
                    </form>
                  ) : (
                    <p className="text-sm text-mocha">
                      <Link to="/login" className="text-charcoal underline underline-offset-2 hover:text-mocha transition-colors">Sign in</Link> to leave a review.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-8 pt-12 border-t border-mink">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="section-label mb-2">You May Also Like</p>
                <h2 className="font-serif text-3xl font-light text-charcoal">Related Pieces</h2>
              </div>
              <Link to={`/collections?category=${product.category_slug}`} className="btn-ghost hidden md:flex">
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
              {related.map((p,i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
