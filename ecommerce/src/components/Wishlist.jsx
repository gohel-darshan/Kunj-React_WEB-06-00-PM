import { useState, useEffect } from 'react';
import './Wishlist.css';

const Wishlist = ({ closeWishlist, addToCart }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  
  // Load wishlist items from localStorage on component mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist));
    }
  }, []);
  
  // Save wishlist items to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);
  
  const removeFromWishlist = (productId) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== productId));
  };
  
  const handleAddToCart = (product) => {
    addToCart(product);
    // Optionally remove from wishlist after adding to cart
    // removeFromWishlist(product.id);
  };
  
  return (
    <div className="wishlist-overlay" onClick={(e) => e.target.className === 'wishlist-overlay' && closeWishlist()}>
      <div className="wishlist-container">
        <div className="wishlist-header">
          <h2>Your Wishlist</h2>
          <button className="close-btn" onClick={closeWishlist}>×</button>
        </div>
        
        {wishlistItems.length === 0 ? (
          <div className="empty-wishlist">
            <div className="empty-wishlist-icon">♥</div>
            <p>Your wishlist is empty</p>
            <button className="btn btn-primary" onClick={closeWishlist}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="wishlist-items">
              {wishlistItems.map(item => (
                <div className="wishlist-item" key={item.id}>
                  <div className="wishlist-item-img">
                    <img src={item.image} alt={item.title} />
                  </div>
                  
                  <div className="wishlist-item-info">
                    <h3 className="wishlist-item-title">{item.title}</h3>
                    <div className="wishlist-item-price">${item.price.toFixed(2)}</div>
                    
                    <div className="wishlist-item-rating">
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <span 
                            key={i} 
                            className={i < Math.round(item.rating.rate) ? 'star filled' : 'star'}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="rating-count">({item.rating.count})</span>
                    </div>
                  </div>
                  
                  <div className="wishlist-item-actions">
                    <button 
                      className="btn-add-to-cart"
                      onClick={() => handleAddToCart(item)}
                    >
                      Add to Cart
                    </button>
                    
                    <button 
                      className="btn-remove"
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="wishlist-footer">
              <button className="btn btn-secondary" onClick={closeWishlist}>
                Continue Shopping
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  // Add all items to cart
                  wishlistItems.forEach(item => addToCart(item));
                  // Clear wishlist
                  setWishlistItems([]);
                }}
              >
                Add All to Cart
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;