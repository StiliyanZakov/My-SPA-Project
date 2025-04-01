import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getOrders } from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h1>Моите поръчки</h1>
      {orders.length === 0 ? (
        <p>Нямате поръчки</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <h3>Поръчка #{order.id}</h3>
                <span className="order-date">
                  {new Date(order.createdAt).toLocaleDateString('bg-BG')}
                </span>
              </div>
              <div className="order-items">
                {order.items.map((item) => (
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
              <div className="order-summary">
                <p>Обща сума: {order.total} лв.</p>
                <p>Статус: {order.status}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders; 