import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [wished, setWished] = useState(false);
  const [adding, setAdding] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const imgSrc = product.image_url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop';

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error('Please sign in to add to cart'); return; }
    setAdding(true);
    try {
      await addToCart(product.id);
      toast.success(`${product.name} added to cart`);
    } catch {
      toast.error('Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  const handleWish = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setWished(w => !w);
    if (!wished) toast.success('Added to wishlist');
  };

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block opacity-0 animate-fadeUp"
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'forwards' }}
    >
      {/* Image container */}
      <div className="relative overflow-hidden bg-sand aspect-[3/4]">
        {/* Skeleton */}
        {!imgLoaded && <div className="absolute inset-0 skeleton" />}

        <img
          src={imgSrc}
          alt={product.name}
          onLoad={() => setImgLoaded(true)}
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600'; setImgLoaded(true); }}
          className={`w-full h-full object-cover transition-all duration-700 ease-expo group-hover:scale-[1.06] ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/10 transition-all duration-500" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.discount_percentage > 0 && (
            <span className="tag bg-espresso text-cream text-2xs">−{product.discount_percentage}%</span>
          )}
          {product.is_featured && (
            <span className="tag bg-gold text-white text-2xs">New</span>
          )}
          {product.stock <= 3 && product.stock > 0 && (
            <span className="tag bg-white/90 text-charcoal text-2xs">Only {product.stock} left</span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleWish}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm flex items-center justify-center
                     opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0
                     transition-all duration-300 hover:bg-white"
        >
          <Heart
            size={14}
            strokeWidth={1.5}
            fill={wished ? '#b8965a' : 'none'}
            stroke={wished ? '#b8965a' : '#1a1a1a'}
          />
        </button>

        {/* Bottom action bar */}
        <div className="absolute bottom-0 left-0 right-0 flex translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-expo">
          <button
            onClick={handleAddToCart}
            disabled={adding || product.stock === 0}
            className="flex-1 bg-charcoal text-cream text-2xs font-medium tracking-widest2 uppercase py-3.5
                       flex items-center justify-center gap-2 hover:bg-espresso transition-colors duration-200
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <ShoppingBag size={13} strokeWidth={1.5} />
            {product.stock === 0 ? 'Sold Out' : adding ? 'Adding…' : 'Add to Bag'}
          </button>
          <Link
            to={`/product/${product.slug}`}
            onClick={e => e.stopPropagation()}
            className="w-12 bg-white/95 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors duration-200 border-l border-mink"
          >
            <Eye size={14} strokeWidth={1.5} className="text-charcoal" />
          </Link>
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 space-y-1.5 px-0.5">
        <p className="text-2xs tracking-widest uppercase text-mocha font-medium">{product.category_name}</p>
        <h3 className="font-serif text-base font-light text-charcoal leading-snug group-hover:text-mocha transition-colors duration-200 line-clamp-2">
          {product.name}
        </h3>

        {/* Stars */}
        {product.review_count > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={10} strokeWidth={1}
                  fill={s <= Math.round(Number(product.rating)) ? '#b8965a' : 'none'}
                  stroke={s <= Math.round(Number(product.rating)) ? '#b8965a' : '#c4b8a8'}
                />
              ))}
            </div>
            <span className="text-2xs text-taupe">({product.review_count})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 pt-0.5">
          <span className="text-sm font-medium text-charcoal">${parseFloat(product.price).toFixed(2)}</span>
          {product.compare_price && parseFloat(product.compare_price) > parseFloat(product.price) && (
            <span className="text-2xs text-taupe line-through">${parseFloat(product.compare_price).toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
