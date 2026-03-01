import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight } from 'lucide-react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const STATUS_STYLES = {
  pending:    'bg-amber-50   text-amber-700  border-amber-200',
  processing: 'bg-blue-50    text-blue-700   border-blue-200',
  shipped:    'bg-purple-50  text-purple-700  border-purple-200',
  delivered:  'bg-green-50   text-green-700  border-green-200',
  cancelled:  'bg-red-50     text-red-600    border-red-200',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      API.get('/orders/').then(r => setOrders(r.data)).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <p className="font-serif text-3xl font-light text-charcoal mb-3">My Orders</p>
      <p className="text-sm text-mocha mb-8">Please sign in to view your order history</p>
      <Link to="/login" className="btn-primary">Sign In</Link>
    </div>
  );

  return (
    <div className="bg-cream min-h-screen">
      {/* Header */}
      <div className="border-b border-mink bg-sand">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10">
          <p className="section-label mb-2">Account</p>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-charcoal">My Orders</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-12">
        {loading ? (
          <div className="space-y-5 animate-pulse">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="skeleton h-36 rounded" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-28">
            <Package size={40} strokeWidth={1} className="mx-auto text-taupe mb-6" />
            <p className="font-serif text-3xl font-light text-charcoal mb-3">No Orders Yet</p>
            <p className="text-sm text-mocha mb-8">When you place an order, it will appear here.</p>
            <Link to="/collections" className="btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order, i) => (
              <div key={order.id}
                className="bg-white border border-mink p-7 animate-fadeUp"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'forwards' }}>
                {/* Order header */}
                <div className="flex items-start justify-between mb-5 pb-5 border-b border-mink">
                  <div>
                    <p className="text-2xs tracking-widest uppercase text-mocha mb-1">Order</p>
                    <p className="font-serif text-xl font-light text-charcoal">#{order.id}</p>
                    <p className="text-xs text-taupe mt-1">
                      {new Date(order.created_at).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}
                    </p>
                  </div>
                  <span className={`text-2xs font-medium tracking-widest uppercase border px-3 py-1.5 ${STATUS_STYLES[order.status] || 'bg-sand text-mocha border-mink'}`}>
                    {order.status}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-2.5 mb-5">
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <span className="text-mocha">
                        <span className="text-charcoal font-medium">{item.product_name}</span>
                        <span className="text-taupe ml-2">× {item.quantity}</span>
                      </span>
                      <span className="text-charcoal">${parseFloat(item.subtotal).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-5 border-t border-mink">
                  <div className="text-xs text-mocha">
                    <p className="font-medium text-charcoal">{order.shipping_name}</p>
                    <p className="text-taupe mt-0.5 max-w-xs truncate">{order.shipping_address}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xs tracking-widest uppercase text-mocha mb-1">Total</p>
                    <p className="font-serif text-xl font-light text-charcoal">${parseFloat(order.total_amount).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link to="/collections" className="btn-ghost">
            Continue Shopping <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
