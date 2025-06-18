import { useState } from 'react';
import './ProductInfo.css';

const ProductInfo = ({ product, addToCart, addToWishlist }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);
  
  // Mock colors and sizes since they're not in the Fake Store API
  const colors = ['#000000', '#3a5ba0', '#7d0d1b', '#7d5d3f'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  
  // Determine if this product might have colors/sizes based on category
  const hasColors = product.category === 'men\'s clothing' || product.category === 'women\'s clothing';
  const hasSizes = product.category === 'men\'s clothing' || product.category === 'women\'s clothing';
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    setQuantity(value >= 1 ? value : 1);
  };
  
  const decrementQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
  };
  
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const handleAddToCart = () => {
    // Check if color/size selection is required but not selected
    if (hasColors && !selectedColor) {
      alert('Please select a color');
      return;
    }
    
    if (hasSizes && !selectedSize) {
      alert('Please select a size');
      return;
    }
    
    // Add product to cart with selected options
    const productWithOptions = {
      ...product,
      quantity,
      selectedOptions: {
        color: selectedColor,
        size: selectedSize
      }
    };
    
    addToCart(productWithOptions);
    
    // Show success message
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };
  
  const handleAddToWishlist = () => {
    addToWishlist(product);
  };
  
  // Mock function to determine stock status
  const getStockStatus = () => {
    // Generate a random stock level for demo purposes
    const stockLevel = Math.floor(Math.random() * 30);
    
    if (stockLevel === 0) {
      return { status: 'Out of Stock', className: 'out-of-stock' };
    } else if (stockLevel < 5) {
      return { status: `Low Stock (${stockLevel} left)`, className: 'low-stock' };
    } else {
      return { status: 'In Stock', className: 'in-stock' };
    }
  };
  
  const stockStatus = getStockStatus();
  
  return (
    <div className="product-info">
      <div className="product-category">{product.category}</div>
      <h1 className="product-title">{product.title}</h1>
      
      <div className="product-rating">
        <div className="stars">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={i < Math.round(product.rating?.rate || 0) ? 'star filled' : 'star'}>★</span>
          ))}
        </div>
        <span className="rating-value">{product.rating?.rate || 0}</span>
        <span className="rating-count">({product.rating?.count || 0} reviews)</span>
      </div>
      
      <div className="product-price">
        ${product.price.toFixed(2)}
      </div>
      
      <div className="product-description">
        <p>{product.description}</p>
      </div>
      
      <div className="product-stock">
        <span className={`stock-status ${stockStatus.className}`}>
          {stockStatus.status}
        </span>
      </div>
      
      {hasColors && (
        <div className="product-colors">
          <h3>Color</h3>
          <div className="color-options">
            {colors.map(color => (
              <button
                key={color}
                className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
          {selectedColor && (
            <div className="selected-option">
              Selected color: <span style={{ 
                display: 'inline-block', 
                width: '12px', 
                height: '12px', 
                borderRadius: '50%', 
                backgroundColor: selectedColor,
                marginLeft: '5px'
              }}></span>
            </div>
          )}
        </div>
      )}
      
      {hasSizes && (
        <div className="product-sizes">
          <h3>Size</h3>
          <div className="size-options">
            {sizes.map(size => (
              <button
                key={size}
                className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
          {selectedSize && (
            <div className="selected-option">
              Selected size: {selectedSize}
            </div>
          )}
        </div>
      )}
      
      <div className="product-quantity">
        <h3>Quantity</h3>
        <div className="quantity-selector">
          <button 
            className="quantity-btn decrement" 
            onClick={decrementQuantity}
            disabled={quantity <= 1}
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
            className="quantity-btn increment"
            onClick={incrementQuantity}
          >
            +
          </button>
        </div>
      </div>
      
      <div className="product-actions">
        <button 
          className={`btn-add-to-cart ${addedToCart ? 'added' : ''}`}
          onClick={handleAddToCart}
        >
          {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
        </button>
        <button 
          className="btn-add-to-wishlist"
          onClick={handleAddToWishlist}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          Add to Wishlist
        </button>
      </div>
      
      <div className="product-meta">
        <div className="meta-item sku">
          <span className="meta-label">SKU:</span>
          <span className="meta-value">PD-{product.id}-{product.category?.substring(0, 3).toUpperCase()}</span>
        </div>
        <div className="meta-item category">
          <span className="meta-label">Category:</span>
          <span className="meta-value">{product.category}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;