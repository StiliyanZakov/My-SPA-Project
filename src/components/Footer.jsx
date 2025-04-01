import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>
            We are dedicated to providing the best shopping experience with quality products
            and excellent customer service.
          </p>
        </div>
        <div className="footer-section">
          <h3>Contact</h3>
          <ul>
            <li><span>Email: support@example.com</span></li>
            <li><span>Phone: (555) 123-4567</span></li>
            <li><span>Address: 123 Shopping Street, City, Country</span></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Links</h3>
          <ul>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/cart">Cart</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} E-Commerce. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer; 