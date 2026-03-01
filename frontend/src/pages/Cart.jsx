import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';

export default function Cart() {
  const { cart, updateItem, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkoutForm, setCheckoutForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [ordering, setOrdering] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  if (!user) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <ShoppingBag size={40} strokeWidth={1} className="text-taupe mb-6" />
      <h2 className="font-serif text-3xl font-light text-charcoal mb-2">Your Bag</h2>
      <p className="text-sm text-mocha mb-8">Sign in to view your shopping bag</p>
      <Link to="/login" className="btn-primary">Sign In</Link>
    </div>
  );

  if (cart.items.length === 0) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <ShoppingBag size={40} strokeWidth={1} className="text-taupe mb-6" />
      <h2 className="font-serif text-3xl font-light text-charcoal mb-2">Your Bag is Empty</h2>
      <p className="text-sm text-mocha mb-8">Discover our curated collection of home decor</p>
      <Link to="/collections" className="btn-primary">Start Shopping</Link>
    </div>
  );

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setOrdering(true);
    try {
      await API.post('/orders/place/', checkoutForm);
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch { toast.error('Failed to place order. Please try again.'); }
    finally { setOrdering(false); }
  };

  const subtotal = parseFloat(cart.total);
  const shipping = subtotal >= 150 ? 0 : 12;
  const total = subtotal + shipping;

  return (
    <div className="bg-cream min-h-screen">
      {/* Header */}
      <div className="border-b border-mink bg-sand">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10">
          <p className="section-label mb-2">Your Selection</p>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-charcoal">Shopping Bag</h1>
          <p className="text-xs text-mocha mt-2">{cart.item_count} item{cart.item_count !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Items list */}
          <div className="lg:col-span-2 space-y-0">
            {cart.items.map((item, i) => (
              <div key={item.id}
                className={`flex gap-5 py-7 ${i !== 0 ? 'border-t border-mink' : ''} animate-fadeUp`}
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'forwards' }}>
                {/* Image */}
                <Link to={`/product/${item.product.slug}`} className="flex-shrink-0">
                  <div className="w-24 h-28 md:w-28 md:h-36 overflow-hidden bg-sand">
                    <img
                      src={item.product.image_url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300'}
                      alt={item.product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300'; }}
                    />
                  </div>
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-2xs tracking-widest uppercase text-mocha mb-1">{item.product.category_name}</p>
                      <Link to={`/product/${item.product.slug}`}>
                        <h3 className="font-serif text-base font-light text-charcoal hover:text-mocha transition-colors line-clamp-2">{item.product.name}</h3>
                      </Link>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-taupe hover:text-red-400 transition-colors flex-shrink-0 mt-0.5">
                      <X size={16} strokeWidth={1.5} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Quantity */}
                    <div className="flex items-center border border-mink">
                      <button onClick={() => updateItem(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-mocha hover:bg-sand transition-colors">
                        <Minus size={12} strokeWidth={1.5} />
                      </button>
                      <span className="w-8 text-center text-xs font-medium text-charcoal">{item.quantity}</span>
                      <button onClick={() => updateItem(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-mocha hover:bg-sand transition-colors">
                        <Plus size={12} strokeWidth={1.5} />
                      </button>
                    </div>
                    <span className="font-serif text-lg font-light text-charcoal">${parseFloat(item.subtotal).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-6 border-t border-mink">
              <button onClick={clearCart} className="text-2xs tracking-widest uppercase text-taupe hover:text-red-400 transition-colors flex items-center gap-1.5">
                <Trash2 size={12} strokeWidth={1.5} /> Clear bag
              </button>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-sand border border-mink p-8 sticky top-24 animate-fadeUp delay-200">
              <h2 className="font-serif text-xl font-light text-charcoal mb-6">Order Summary</h2>

              <div className="space-y-3 text-sm pb-5 border-b border-mink">
                <div className="flex justify-between text-mocha">
                  <span>Subtotal ({cart.item_count} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-mocha">
                  <span>Shipping</span>
                  {shipping === 0
                    ? <span className="text-green-600 text-xs font-medium">Free</span>
                    : <span>${shipping.toFixed(2)}</span>}
                </div>
                {shipping > 0 && (
                  <p className="text-2xs text-taupe">Add ${(150 - subtotal).toFixed(2)} more for free shipping</p>
                )}
              </div>

              <div className="flex justify-between items-baseline pt-5 mb-8">
                <span className="font-serif text-xl font-light text-charcoal">Total</span>
                <span className="font-serif text-2xl font-light text-charcoal">${total.toFixed(2)}</span>
              </div>

              {!showCheckout ? (
                <button onClick={() => setShowCheckout(true)} className="w-full btn-primary flex items-center justify-center gap-2 mb-4">
                  Proceed to Checkout <ArrowRight size={14} strokeWidth={1.5} />
                </button>
              ) : (
                <form onSubmit={handlePlaceOrder} className="space-y-4 mb-4">
                  <div>
                    <label className="text-2xs tracking-widest uppercase text-mocha block mb-1.5">Full Name</label>
                    <input className="input-box text-sm" placeholder="Jane Smith" value={checkoutForm.name}
                      onChange={e => setCheckoutForm(f => ({ ...f, name: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="text-2xs tracking-widest uppercase text-mocha block mb-1.5">Email</label>
                    <input className="input-box text-sm" type="email" placeholder="jane@email.com" value={checkoutForm.email}
                      onChange={e => setCheckoutForm(f => ({ ...f, email: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="text-2xs tracking-widest uppercase text-mocha block mb-1.5">Phone</label>
                    <input className="input-box text-sm" placeholder="+1 234 567 8900" value={checkoutForm.phone}
                      onChange={e => setCheckoutForm(f => ({ ...f, phone: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="text-2xs tracking-widest uppercase text-mocha block mb-1.5">Shipping Address</label>
                    <textarea className="input-box text-sm resize-none" rows={3} placeholder="123 Main St, City, State, ZIP"
                      value={checkoutForm.address} onChange={e => setCheckoutForm(f => ({ ...f, address: e.target.value }))} required />
                  </div>
                  <button type="submit" disabled={ordering} className="w-full btn-primary">
                    {ordering ? 'Placing Order…' : 'Place Order'}
                  </button>
                  <button type="button" onClick={() => setShowCheckout(false)} className="w-full text-2xs tracking-widest uppercase text-mocha hover:text-charcoal transition-colors py-1">
                    ← Back to Summary
                  </button>
                </form>
              )}

              <div className="flex items-center justify-center gap-3 pt-2">
                {['VISA','MC','AMEX','PayPal'].map(p => (
                  <span key={p} className="text-2xs text-taupe border border-mink px-2 py-0.5">{p}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
