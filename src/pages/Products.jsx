import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductsAsync } from '../store/slices/productSlice'
import { addToCart } from '../store/slices/cartSlice'
import '../styles/global.css'

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(state => state.products);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    console.log('Dispatching fetchProductsAsync');
    dispatch(fetchProductsAsync());
  }, [dispatch]);

  // Extract categories from products
  useEffect(() => {
    if (products && products.length > 0) {
      const categorySet = new Set();
      products.forEach(product => {
        if (product.category) {
          categorySet.add(product.category);
        }
      });
      setCategories(Array.from(categorySet));
    }
  }, [products]);

  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, quantity: 1 }));
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

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
    <div className="products-container">
      <h1>Продукти</h1>
      
      <div className="category-filter">
        <button 
          className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`} 
          onClick={() => setSelectedCategory('all')}
        >
          Всички
        </button>
        {categories.map(category => (
          <button 
            key={category} 
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`} 
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      
      <div className="products-grid">
        {filteredProducts && filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.title} className="product-image" />
              <div className="product-info">
                <h3 className="product-title">{product.title}</h3>
                <p className="product-price">{product.price} лв.</p>
                <p className="product-description">{product.description}</p>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="btn btn-primary"
                >
                  Добави в количката
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-products">
            <p>Няма намерени продукти в тази категория</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;