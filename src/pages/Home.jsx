import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import IconSection from '../components/IconSection';
import '../styles/global.css';

const Home = () => {
  const { user } = useSelector((state) => state.auth);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Add animation classes once component is mounted
    setIsLoaded(true);
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className={`hero-section ${isLoaded ? 'fade-in' : ''}`}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className={`hero-title ${isLoaded ? 'slide-up' : ''}`}>
            Discover Amazing Products at Great Prices
          </h1>
          <p className={`hero-description ${isLoaded ? 'slide-up delay-1' : ''}`}>
            Shop our high-quality selection curated just for you
          </p>
          {!user && (
            <div className={`hero-actions ${isLoaded ? 'slide-up delay-2' : ''}`}>
              <Link to="/register" className="hero-button primary">
                Create Account
              </Link>
              <Link to="/login" className="hero-button secondary">
                Sign In
              </Link>
            </div>
          )}
          {user && (
            <div className={`hero-actions ${isLoaded ? 'slide-up delay-2' : ''}`}>
              <Link to="/products" className="hero-button primary">
                Shop Now
              </Link>
            </div>
          )}
        </div>
        <div className="hero-wave">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,96L80,85.3C160,75,320,53,480,53.3C640,53,800,75,960,80C1120,85,1280,75,1360,69.3L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" fill="#ffffff"/>
          </svg>
        </div>
      </section>
      
      {/* Featured Categories */}
      <section className="categories-section container">
        <h2 className={`section-title ${isLoaded ? 'fade-in delay-3' : ''}`}>
          Explore Our Categories
        </h2>
        <div className="categories-grid">
          <div className="category-card">
            <div className="category-image">
              <img src="https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" alt="Electronics" />
            </div>
            <div className="category-content">
              <h3>Electronics</h3>
              <Link to="/products" className="category-link">Shop Now →</Link>
            </div>
          </div>
          <div className="category-card">
            <div className="category-image">
              <img src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=905&q=80" alt="Clothing" />
            </div>
            <div className="category-content">
              <h3>Clothing</h3>
              <Link to="/products" className="category-link">Shop Now →</Link>
            </div>
          </div>
          <div className="category-card">
            <div className="category-image">
              <img src="https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80" alt="Home Decor" />
            </div>
            <div className="category-content">
              <h3>Home Decor</h3>
              <Link to="/products" className="category-link">Shop Now →</Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="benefits-section container">
        <h2 className={`section-title ${isLoaded ? 'fade-in delay-4' : ''}`}>
          Why Choose Us?
        </h2>
        <IconSection />
      </section>
      
      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="newsletter-content container">
          <h2>Subscribe to Our Newsletter</h2>
          <p>Stay updated with our latest products and offers</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Your email address" />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </section>
      
      {/* Custom Styles */}
      <style jsx>{`
        .home-page {
          overflow-x: hidden;
        }
        
        /* Hero Section */
        .hero-section {
          position: relative;
          height: 85vh;
          min-height: 600px;
          background-image: url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80');
          background-size: cover;
          background-position: center;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          overflow: hidden;
        }
        
        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(77, 26, 127, 0.85) 0%, rgba(43, 9, 107, 0.9) 100%);
        }
        
        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 800px;
          padding: 0 2rem;
        }
        
        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
          line-height: 1.2;
        }
        
        .hero-description {
          font-size: 1.5rem;
          margin-bottom: 2.5rem;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          opacity: 0.9;
          line-height: 1.6;
        }
        
        .hero-actions {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }
        
        .hero-button {
          padding: 0.9rem 2.2rem;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .hero-button.primary {
          background: linear-gradient(135deg, #6e8efb, #a777e3);
          color: white;
          border: none;
        }
        
        .hero-button.primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
          background: linear-gradient(135deg, #5d7df9, #9560e2);
        }
        
        .hero-button.secondary {
          background: rgba(255, 255, 255, 0.15);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(5px);
        }
        
        .hero-button.secondary:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }
        
        .hero-wave {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          z-index: 1;
        }
        
        /* Benefits Section */
        .benefits-section {
          padding: 5rem 0 3rem;
          text-align: center;
        }
        
        .section-title {
          font-size: 2.5rem;
          margin-bottom: 3rem;
          font-weight: 700;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline-block;
        }
        
        /* Categories Section */
        .categories-section {
          padding: 5rem 0;
          text-align: center;
        }
        
        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }
        
        .category-card {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          position: relative;
        }
        
        .category-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 35px rgba(0, 0, 0, 0.15);
        }
        
        .category-image {
          height: 250px;
          overflow: hidden;
        }
        
        .category-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .category-card:hover .category-image img {
          transform: scale(1.05);
        }
        
        .category-content {
          padding: 1.5rem;
          background: white;
          position: relative;
        }
        
        .category-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #333;
        }
        
        .category-link {
          display: inline-block;
          color: #6e8efb;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .category-link:hover {
          color: #a777e3;
          transform: translateX(3px);
        }
        
        /* Newsletter Section */
        .newsletter-section {
          padding: 5rem 0;
          background: linear-gradient(135deg, #f5f7ff 0%, #ebefff 100%);
          text-align: center;
        }
        
        .newsletter-content {
          max-width: 600px;
          margin: 0 auto;
        }
        
        .newsletter-content h2 {
          font-size: 2.2rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #333;
        }
        
        .newsletter-content p {
          font-size: 1.1rem;
          color: #666;
          margin-bottom: 2rem;
        }
        
        .newsletter-form {
          display: flex;
          gap: 0.5rem;
          max-width: 500px;
          margin: 0 auto;
        }
        
        .newsletter-form input {
          flex: 1;
          padding: 1rem 1.5rem;
          border: 1px solid #ddd;
          border-radius: 50px;
          font-size: 1rem;
          outline: none;
          transition: all 0.3s ease;
        }
        
        .newsletter-form input:focus {
          border-color: #6e8efb;
          box-shadow: 0 0 0 3px rgba(110, 142, 251, 0.2);
        }
        
        .newsletter-form button {
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #6e8efb, #a777e3);
          color: white;
          border: none;
          border-radius: 50px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .newsletter-form button:hover {
          background: linear-gradient(135deg, #5d7df9, #9560e2);
          transform: translateY(-2px);
        }
        
        /* Animations */
        .fade-in {
          animation: fadeIn 1s ease forwards;
        }
        
        .slide-up {
          opacity: 0;
          transform: translateY(30px);
          animation: slideUp 0.8s ease forwards;
        }
        
        .delay-1 {
          animation-delay: 0.2s;
        }
        
        .delay-2 {
          animation-delay: 0.4s;
        }
        
        .delay-3 {
          animation-delay: 0.6s;
        }
        
        .delay-4 {
          animation-delay: 0.8s;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Responsive styles */
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }
          
          .hero-description {
            font-size: 1.2rem;
          }
          
          .section-title {
            font-size: 2rem;
          }
          
          .newsletter-form {
            flex-direction: column;
          }
          
          .newsletter-form button {
            width: 100%;
          }
        }
        
        @media (max-width: 480px) {
          .hero-title {
            font-size: 2rem;
          }
          
          .hero-actions {
            flex-direction: column;
            gap: 1rem;
          }
          
          .hero-button {
            width: 100%;
          }
        }
        
        /* Стилове за навигационните бутони */
        .nav-button {
          padding: 0.6rem 1.2rem;
          border-radius: 50px;
          font-size: 0.95rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.3s ease;
          color: #333;
          background: transparent;
          position: relative;
        }
        
        .nav-button:hover {
          color: #6e8efb;
        }
        
        .nav-button::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -2px;
          left: 50%;
          background: linear-gradient(135deg, #6e8efb, #a777e3);
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }
        
        .nav-button:hover::after {
          width: 70%;
        }
        
        .nav-button.active {
          color: #6e8efb;
          font-weight: 600;
        }
        
        .nav-button.active::after {
          width: 80%;
        }
        
        /* За мобилни устройства */
        @media (max-width: 768px) {
          .nav-button {
            padding: 0.8rem 1rem;
            width: 100%;
            text-align: center;
            border-radius: 8px;
          }
          
          .nav-button:hover {
            background: #f5f7ff;
          }
        }
      `}</style>
    </div>
  );
};

export default Home; 