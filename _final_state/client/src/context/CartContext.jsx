import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setCart(null);
        }
    }, [user]);

    const fetchCart = async () => {
        try {
            const { data } = await axios.get('/api/cart', {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setCart(data);
        } catch (error) {
            console.error(error);
        }
    };

    const addToCart = async (productId, quantity) => {
        try {
            setLoading(true);
            // Optimistic update could be done here
            const { data } = await axios.post(
                '/api/cart',
                { productId, quantity },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            setCart(data);
            setLoading(false);
            return { success: true };
        } catch (error) {
            setLoading(false);
            return { success: false, message: error.response?.data?.message };
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            setLoading(true);
            const { data } = await axios.delete(`/api/cart/${itemId}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setCart(data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error(error);
        }
    };

    const cartItemCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

    return (
        <CartContext.Provider
            value={{ cart, addToCart, removeFromCart, loading, cartItemCount }}
        >
            {children}
        </CartContext.Provider>
    );
};
