import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  removeFromCart, 
  updateQuantity, 
  clearCart 
} from '../store/slices/cartSlice';
import '../styles/global.css';

const Cart = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  const [total, setTotal] = useState(0);
  
  useEffect(() => {
    const newTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(newTotal);
  }, [items]);
  
  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
  };
  
  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
  };
  
  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
    }
  };
  
  if (items.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any items to your cart yet.</p>
        <Link to="/products" className="btn btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }
  
  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>Your Cart</h1>
        <p>{items.length} {items.length === 1 ? 'item' : 'items'}</p>
        <button onClick={handleClearCart} className="btn btn-danger">
          Clear Cart
        </button>
      </div>
      
      <div className="cart-content">
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-image">
                <img src={item.image} alt={item.title} />
              </div>
              <div className="cart-item-details">
                <h3 className="cart-item-title">{item.title}</h3>
                <p className="cart-item-price">{item.price.toFixed(2)} lv.</p>
                <div className="cart-item-actions">
                  <div className="quantity-controls">
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                  <button 
                    onClick={() => handleRemoveItem(item.id)}
                    className="btn-remove"
                  >
                    Remove
                  </button>
                </div>
                <p className="cart-item-subtotal">
                  Subtotal: <strong>{(item.price * item.quantity).toFixed(2)} lv.</strong>
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="cart-summary">
          <h2>Order Summary</h2>
          
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>{total.toFixed(2)} lv.</span>
          </div>
          
          <div className="summary-row">
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          
          <div className="summary-row total">
            <span>Total:</span>
            <span>{total.toFixed(2)} lv.</span>
          </div>
          
          <button className="btn btn-primary checkout-btn">
            Checkout
          </button>
          
          <Link to="/products" className="btn btn-secondary continue-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart; 