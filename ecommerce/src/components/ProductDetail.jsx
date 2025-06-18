import { useState, useEffect } from 'react';
import './ProductDetail.css';

const ProductDetail = ({ productId, addToCart, closeDetail }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [imageZoomed, setImageZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Dummy additional images (in a real app these would come from the API)
  const dummyImages = [
    null, // Will be replaced with actual product image
    'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg',
    'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg',
    'https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg'
  ];

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
        // Set the first dummy image to be the actual product image
        dummyImages[0] = data.image;
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

  const handleZoom = (e) => {
    if (!imageZoomed) return;
    
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setZoomPosition({ x, y });
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
  };

  if (loading) {
    return (
      <div className="product-detail-modal">
        <div className="product-detail-container loading-container">
          <div className="spinner-3d">
            <div className="cube">
              <div className="side front"></div>
              <div className="side back"></div>
              <div className="side top"></div>
              <div className="side bottom"></div>
              <div className="side left"></div>
              <div className="side right"></div>
            </div>
          </div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-modal">
        <div className="product-detail-container">
          <div className="product-detail-header">
            <h2>Error</h2>
            <button className="close-btn" onClick={closeDetail}>×</button>
          </div>
          <div className="error">{error || 'Product not found'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-modal">
      <div className="product-detail-container">
        <div className="product-detail-header">
          <h2>Product Details</h2>
          <button className="close-btn" onClick={closeDetail}>×</button>
        </div>
        
        <div className="product-detail-content">
          <div className="product-detail-left">
            <div 
              className={`product-image-main ${imageZoomed ? 'zoomed' : ''}`}
              onMouseMove={handleZoom}
              onMouseEnter={() => setImageZoomed(true)}
              onMouseLeave={() => setImageZoomed(false)}
              style={
                imageZoomed 
                  ? { 
                      backgroundImage: `url(${dummyImages[currentImageIndex] || product.image})`,
                      backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`
                    }
                  : {}
              }
            >
              {!imageZoomed && (
                <img 
                  src={dummyImages[currentImageIndex] || product.image} 
                  alt={product.title} 
                />
              )}
              <div className="image-zoom-hint">
                <span>Hover to zoom</span>
                <span className="zoom-icon">🔍</span>
              </div>
            </div>
            
            <div className="product-image-thumbnails">
              {dummyImages.map((img, index) => (
                <div 
                  key={index}
                  className={`thumbnail ${currentImageIndex === index ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img src={img || product.image} alt={`Thumbnail ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
          
          <div className="product-detail-right">
            <div className="product-detail-category">{product.category}</div>
            <h1 className="product-detail-title">{product.title}</h1>
            
            <div className="product-detail-rating">
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
              <span className="rating-count">{product.rating.rate} ({product.rating.count} reviews)</span>
            </div>
            
            <div className="product-detail-price">
              <span className="current-price">${product.price.toFixed(2)}</span>
              {Math.random() > 0.7 && (
                <span className="original-price">${(product.price * 1.2).toFixed(2)}</span>
              )}
            </div>
            
            <div className="product-detail-stock">
              <span className="stock-status in-stock">✓ In Stock</span>
              <span className="stock-count">({Math.floor(Math.random() * 50) + 10} items left)</span>
            </div>
            
            <div className="product-detail-tabs">
              <div className="tab-buttons">
                <button
                  className={activeTab === 'description' ? 'active' : ''}
                  onClick={() => setActiveTab('description')}
                >
                  Description
                </button>
                <button
                  className={activeTab === 'specifications' ? 'active' : ''}
                  onClick={() => setActiveTab('specifications')}
                >
                  Specifications
                </button>
                <button
                  className={activeTab === 'reviews' ? 'active' : ''}
                  onClick={() => setActiveTab('reviews')}
                >
                  Reviews
                </button>
              </div>
              
              <div className="tab-content">
                {activeTab === 'description' && (
                  <div className="description">
                    <p>{product.description}</p>
                  </div>
                )}
                
                {activeTab === 'specifications' && (
                  <div className="specifications">
                    <table>
                      <tbody>
                        <tr>
                          <td>Category</td>
                          <td>{product.category}</td>
                        </tr>
                        <tr>
                          <td>Material</td>
                          <td>Premium Quality</td>
                        </tr>
                        <tr>
                          <td>Dimensions</td>
                          <td>Product specific</td>
                        </tr>
                        <tr>
                          <td>Weight</td>
                          <td>Product specific</td>
                        </tr>
                        <tr>
                          <td>Warranty</td>
                          <td>1 Year</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
                
                {activeTab === 'reviews' && (
                  <div className="reviews">
                    <div className="review-summary">
                      <div className="average-rating">
                        <span className="big-rating">{product.rating.rate}</span>
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
                        <span className="total-reviews">Based on {product.rating.count} reviews</span>
                      </div>
                    </div>
                    
                    <div className="user-reviews">
                      <div className="review">
                        <div className="review-header">
                          <span className="reviewer-name">Jane Doe</span>
                          <div className="review-rating">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < 5 ? 'star filled' : 'star'}>★</span>
                            ))}
                          </div>
                          <span className="review-date">2 weeks ago</span>
                        </div>
                        <p className="review-text">Great product! I'm very satisfied with the quality.</p>
                      </div>
                      
                      <div className="review">
                        <div className="review-header">
                          <span className="reviewer-name">John Smith</span>
                          <div className="review-rating">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < 4 ? 'star filled' : 'star'}>★</span>
                            ))}
                          </div>
                          <span className="review-date">1 month ago</span>
                        </div>
                        <p className="review-text">Good quality for the price. Would recommend.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="product-detail-actions">
              <div className="quantity-selector">
                <button 
                  className="quantity-btn" 
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                >
                  -
                </button>
                <input 
                  type="number" 
                  value={quantity} 
                  onChange={handleQuantityChange}
                  min="1"
                />
                <button 
                  className="quantity-btn"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
              
              <button className="btn-add-to-cart" onClick={handleAddToCart}>
                Add to Cart
              </button>
              
              <button className="btn-wishlist">
                <span className="heart-icon">♥</span>
                <span>Add to Wishlist</span>
              </button>
            </div>
            
            <div className="product-detail-meta">
              <div className="product-detail-share">
                <span>Share:</span>
                <div className="social-icons">
                  <a href="#" className="social-icon">Facebook</a>
                  <a href="#" className="social-icon">Twitter</a>
                  <a href="#" className="social-icon">Pinterest</a>
                </div>
              </div>
              
              <div className="product-detail-tags">
                <span>Tags:</span>
                <div className="tags">
                  <a href="#" className="tag">{product.category}</a>
                  <a href="#" className="tag">Featured</a>
                  <a href="#" className="tag">Popular</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;