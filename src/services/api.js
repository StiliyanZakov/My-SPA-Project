import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3030/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('API Request:', {
    url: config.url,
    method: config.method,
    headers: config.headers,
    data: config.data
  });
  return config;
});

// Add response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// Validate email format
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
};

// Authentication
export const login = async (email, password) => {
  try {
    console.log('Attempting login with:', { email });
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error);
    throw error.response?.data || error;
  }
};

export const register = async (userData) => {
  try {
    console.log('Attempting registration with:', { 
      email: userData.email,
      displayName: userData.displayName 
    });
    const response = await api.post('/auth/register', userData);
    console.log('Registration response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response?.data || error);
    throw error.response?.data || error;
  }
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateProfile = async (userData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    console.log('Updating profile with token:', token);
    
    const response = await api.put('/auth/profile', userData);
    console.log('Profile update response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Profile update error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'Error updating profile');
  }
};

export const resetPassword = async (email) => {
  try {
    const response = await api.post('/auth/reset-password', { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Password reset error');
  }
};

// Продукти
export const getProducts = async () => {
  try {
    const response = await axios.get(`${api.defaults.baseURL}/products`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Грешка при зареждане на продуктите');
  }
};

// Количка
export const getCart = async () => {
  try {
    const response = await axios.get(`${api.defaults.baseURL}/cart`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Грешка при зареждане на количката');
  }
};

export const addToCart = async (productId, quantity) => {
  try {
    const response = await axios.post(`${api.defaults.baseURL}/cart/add`, { productId, quantity });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Грешка при добавяне в количката');
  }
};

export const updateCartItem = async (productId, quantity) => {
  try {
    const response = await axios.put(`${api.defaults.baseURL}/cart/update`, { productId, quantity });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Грешка при обновяване на количката');
  }
};

export const removeFromCart = async (productId) => {
  try {
    const response = await axios.delete(`${api.defaults.baseURL}/cart/remove/${productId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Грешка при премахване от количката');
  }
};

export const clearCart = async () => {
  try {
    const response = await axios.delete(`${api.defaults.baseURL}/cart/clear`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Грешка при изчистване на количката');
  }
};

// Поръчки
export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(`${api.defaults.baseURL}/orders`, orderData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Грешка при създаване на поръчка');
  }
};

export const getOrders = async () => {
  try {
    const response = await axios.get(`${api.defaults.baseURL}/orders`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Грешка при зареждане на поръчките');
  }
};

export default api; 