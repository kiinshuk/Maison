import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], total: 0, item_count: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) fetchCart();
    else setCart({ items: [], total: 0, item_count: 0 });
  }, [user]);

  const fetchCart = async () => {
    try {
      const res = await API.get('/cart/');
      setCart(res.data);
    } catch {}
  };

  const addToCart = async (productId, quantity = 1) => {
    setLoading(true);
    try {
      const res = await API.post('/cart/', { product_id: productId, quantity });
      setCart(res.data);
      return true;
    } catch (e) {
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (itemId, quantity) => {
    const res = await API.put(`/cart/item/${itemId}/`, { quantity });
    setCart(res.data);
  };

  const removeItem = async (itemId) => {
    const res = await API.delete(`/cart/item/${itemId}/`);
    setCart(res.data);
  };

  const clearCart = async () => {
    await API.delete('/cart/clear/');
    setCart({ items: [], total: 0, item_count: 0 });
  };

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateItem, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
