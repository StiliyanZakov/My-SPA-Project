import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Get products from store
  const { products, error } = useSelector((state) => state.products);
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    setLoading(false);
  }, [id]);

  // Find the product with the matching id
  useEffect(() => {
    const foundProduct = products.find((p) => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
    }
  }, [products, id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({
        ...product,
        quantity
      }));
    }
  };

  if (loading) {
    return <div className="product-details-loading">Loading product details...</div>;
  }

  if (error) {
    return <div className="product-details-error">Error: {error}</div>;
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product not found</h2>
        <p>The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/products" className="back-to-products">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <div className="product-details-container">
        <div className="product-image-container">
          <img 
            src={product.image} 
            alt={product.name} 
            className="product-details-image"
          />
        </div>
        
        <div className="product-info">
          <h1 className="product-details-name">{product.name}</h1>
          <div className="product-details-price">${product.price.toFixed(2)}</div>
          
          <div className="product-details-category">
            <span>Category:</span> {product.category}
          </div>
          
          <div className="product-details-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>
          
          <div className="product-details-actions">
            <div className="quantity-control">
              <button 
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                className="quantity-btn"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                className="quantity-input"
              />
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="quantity-btn"
              >
                +
              </button>
            </div>
            
            <button 
              className="add-to-cart-btn"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      
      <div className="back-link-container">
        <Link to="/products" className="back-to-products">
          ← Back to Products
        </Link>
      </div>
    </div>
  );
};

export default ProductDetails; 