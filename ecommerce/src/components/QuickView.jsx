import { useState, useEffect } from 'react';
import './QuickView.css';

const QuickView = ({ productId, addToCart, closeQuickView }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setProduct(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch product details. Please try again later.');
        setLoading(false);
        console.error('Error fetching product:', error);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);
  
  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    closeQuickView();
  };
  
  if (loading) {
    return (
      <div className="quick-view-modal">
        <div className="quick-view-container">
          <div className="quick-view-loading">
            <div className="pulse-loader"></div>
            <p>Loading product...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="quick-view-modal">
        <div className="quick-view-container">
          <div className="quick-view-header">
            <h3>Error</h3>
            <button className="close-quick-view" onClick={closeQuickView}>×</button>
          </div>
          <div className="error">{error || 'Product not found'}</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="quick-view-modal" onClick={(e) => e.target.className === 'quick-view-modal' && closeQuickView()}>
      <div className="quick-view-container">
        <div className="quick-view-header">
          <h3>Quick View</h3>
          <button className="close-quick-view" onClick={closeQuickView}>×</button>
        </div>
        
        <div className="quick-view-content">
          <div className="quick-view-image">
            <div className="image-wrapper">
              <img src={product.image} alt={product.title} />
            </div>
          </div>
          
          <div className="quick-view-details">
            <div className="quick-view-category">{product.category}</div>
            <h2 className="quick-view-title">{product.title}</h2>
            
            <div className="quick-view-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <span 
                    key={i} 
                    className={i < Math.round(product.rating.rate) ? 'star filled' : 'star'}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="rating-count">({product.rating.count} reviews)</span>
            </div>
            
            <div className="quick-view-price">${product.price.toFixed(2)}</div>
            
            <div className="quick-view-description">
              <p>{product.description.length > 150 
                ? `${product.description.substring(0, 150)}...` 
                : product.description}
              </p>
            </div>
            
            <div className="quick-view-actions">
              <div className="quantity-selector">
                <button 
                  className="quantity-btn" 
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                >
                  -
                </button>
                <span className="quantity">{quantity}</span>
                <button 
                  className="quantity-btn"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
              
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                Add to Cart
              </button>
            </div>
            
            <div className="quick-view-footer">
              <button className="view-details-btn" onClick={closeQuickView}>
                View Full Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickView;