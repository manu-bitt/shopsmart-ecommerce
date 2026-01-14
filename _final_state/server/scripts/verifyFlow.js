import axios from 'axios';

const API_URL = 'http://localhost:5001/api';
let token = '';

const login = async () => {
    try {
        const res = await axios.post(`${API_URL}/auth/login`, {
            email: 'test@example.com',
            password: 'password123'
        });
        token = res.data.token;
        console.log('Login successful');
    } catch (error) {
        console.error('Login failed:', error.response?.data || error.message);
        process.exit(1);
    }
};

const getCart = async () => {
    try {
        const res = await axios.get(`${API_URL}/cart`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Get Cart:', res.data);
        return res.data;
    } catch (error) {
        console.error('Get Cart failed:', error.response?.data || error.message);
    }
};

const addToCart = async () => {
    try {
        const res = await axios.post(`${API_URL}/cart`, {
            productId: 1,
            quantity: 2
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Add to Cart:', res.data);
    } catch (error) {
        console.error('Add to Cart failed:', error.response?.data || error.message);
    }
};

const createOrder = async () => {
    try {
        const res = await axios.post(`${API_URL}/orders`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Create Order:', res.data);
    } catch (error) {
        console.error('Create Order failed:', error.response?.data || error.message);
    }
};

const getOrders = async () => {
    try {
        const res = await axios.get(`${API_URL}/orders/myorders`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Get Orders:', res.data);
    } catch (error) {
        console.error('Get Orders failed:', error.response?.data || error.message);
    }
};

const run = async () => {
    await login();
    await getCart();
    await addToCart();
    await getCart();
    await createOrder();
    await getOrders();
};

run();
