import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../services/api';
import { clearCart } from '../store/slices/cartSlice';
import './Checkout.css';

const Checkout = () => {
  const { items, total } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'cash'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createOrder({
        ...formData,
        items,
        total
      });
      dispatch(clearCart());
      navigate('/orders');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <h1>Плащане</h1>
      {error && <div className="error-message">{error}</div>}
      
      <div className="checkout-content">
        <div className="checkout-form">
          <h2>Данни за доставка</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">Име</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Фамилия</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Имейл</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Телефон</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Адрес</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">Град</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="postalCode">Пощенски код</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="paymentMethod">Начин на плащане</label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                required
              >
                <option value="cash">Наложен платеж</option>
                <option value="card">С карта</option>
              </select>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Обработка...' : 'Завърши поръчката'}
            </button>
          </form>
        </div>

        <div className="order-summary">
          <h2>Обобщение на поръчката</h2>
          <div className="order-items">
            {items.map((item) => (
              <div key={item.id} className="order-item">
                <img src={item.image} alt={item.title} />
                <div className="item-details">
                  <h4>{item.title}</h4>
                  <p>Количество: {item.quantity}</p>
                  <p>Цена: {item.price} лв.</p>
                </div>
              </div>
            ))}
          </div>
          <div className="order-total">
            <h3>Обща сума: {total} лв.</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 