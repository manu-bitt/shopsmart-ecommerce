import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
    const { cart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const total = cart?.items.reduce((acc, item) => acc + item.quantity * item.product.price, 0) || 0;

    const handlePlaceOrder = async () => {
        try {
            setLoading(true);
            await axios.post('/api/orders', {}, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            // Ideally should refresh cart here or context handles it. Cart items are cleared on server.
            // We should probably force a refresh or manually clear client state.
            // Simplified: redirect to home or order success page.
            alert('Order placed successfully!');
            window.location.href = '/'; // Force reload to refresh context state properly :P
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to place order');
            setLoading(false);
        }
    };

    if (!cart || cart.items.length === 0) return <div>Cart is empty</div>;

    return (
        <div className="bg-white px-4 py-16 sm:px-6 sm:py-24">
            <div className="mx-auto max-w-lg">
                <h1 className="text-2xl font-bold">Checkout</h1>
                <div className="mt-10">
                    <h3 className="text-lg font-medium">Order Summary</h3>
                    <ul className="mt-4 divide-y divide-gray-200 border-b border-t border-gray-200">
                        {cart.items.map((item) => (
                            <li key={item.id} className="flex py-4">
                                <div className="flex-1">
                                    <h4 className="font-medium">{item.product.name}</h4>
                                    <p className="text-gray-500">Qty {item.quantity}</p>
                                </div>
                                <p className="font-medium">${(item.quantity * item.product.price).toFixed(2)}</p>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-6 flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>

                    {error && <p className="text-red-500 mt-4">{error}</p>}

                    <button
                        onClick={handlePlaceOrder}
                        disabled={loading}
                        className="mt-6 w-full rounded-md bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Place Order'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
