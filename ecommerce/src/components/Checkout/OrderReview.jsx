import { useState } from 'react';
import './OrderReview.css';

const OrderReview = ({ 
  cart, 
  shippingInfo, 
  paymentInfo, 
  onBack, 
  onSubmit,
  updateQuantity,
  removeFromCart
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  
  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + shipping + tax - discount;
  
  const handleCouponSubmit = (e) => {
    e.preventDefault();
    
    // Mock coupon validation
    if (couponCode.toUpperCase() === 'WELCOME10') {
      // 10% discount
      const newDiscount = subtotal * 0.1;
      setDiscount(newDiscount);
      setCouponMessage({
        type: 'success',
        text: 'Coupon applied: 10% off your order!'
      });
    } else if (couponCode.toUpperCase() === 'FREESHIP') {
      // Free shipping
      setDiscount(shipping);
      setCouponMessage({
        type: 'success',
        text: 'Coupon applied: Free shipping!'
      });
    } else {
      setDiscount(0);
      setCouponMessage({
        type: 'error',
        text: 'Invalid coupon code'
      });
    }
  };
  
  const handleQuantityChange = (item, newQuantity) => {
    updateQuantity(item.id, newQuantity);
  };
  
  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };
  
  const handlePlaceOrder = () => {
    setIsPlacingOrder(true);
    
    // Simulate API call delay
    setTimeout(() => {
      onSubmit();
      setIsPlacingOrder(false);
    }, 1500);
  };
  
  // Format a price to 2 decimal places
  const formatPrice = (price) => {
    return price.toFixed(2);
  };
  
  // Get payment method display info
  const getPaymentMethodInfo = () => {
    if (paymentInfo.paymentMethod === 'card') {
      return {
        name: 'Credit Card',
        details: `Card ending in ${paymentInfo.cardNumber.slice(-4)}`
      };
    } else if (paymentInfo.paymentMethod === 'paypal') {
      return {
        name: 'PayPal',
        details: 'You will be redirected to PayPal to complete payment'
      };
    }
    return { name: 'Unknown', details: '' };
  };
  
  const paymentMethodInfo = getPaymentMethodInfo();
  
  return (
    <div className="order-review-container">
      <h2 className="form-title">Review Your Order</h2>
      
      <div className="order-sections">
        <div className="order-details">
          <div className="review-section">
            <h3>Items in Your Cart</h3>
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <img src={item.image} alt={item.title} />
                  </div>
                  <div className="item-details">
                    <h4 className="item-title">{item.title}</h4>
                    <div className="item-meta">
                      {item.selectedOptions?.color && (
                        <span className="item-color">
                          Color: <span style={{ 
                            display: 'inline-block', 
                            width: '12px', 
                            height: '12px', 
                            borderRadius: '50%', 
                            backgroundColor: item.selectedOptions.color,
                            marginLeft: '5px'
                          }}></span>
                        </span>
                      )}
                      {item.selectedOptions?.size && (
                        <span className="item-size">
                          Size: {item.selectedOptions.size}
                        </span>
                      )}
                    </div>
                    <div className="item-price">${formatPrice(item.price)}</div>
                  </div>
                  <div className="item-controls">
                    <div className="quantity-control">
                      <button 
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button 
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button 
                      className="remove-item-btn"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="item-total">
                    ${formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="review-section">
            <h3>Shipping Information</h3>
            <div className="info-summary shipping-summary">
              <p><strong>{shippingInfo.firstName} {shippingInfo.lastName}</strong></p>
              <p>{shippingInfo.address}</p>
              <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
              <p>{shippingInfo.country}</p>
              <p>Email: {shippingInfo.email}</p>
              {shippingInfo.phone && <p>Phone: {shippingInfo.phone}</p>}
            </div>
          </div>
          
          <div className="review-section">
            <h3>Payment Method</h3>
            <div className="info-summary payment-summary">
              <p><strong>{paymentMethodInfo.name}</strong></p>
              <p>{paymentMethodInfo.details}</p>
            </div>
          </div>
        </div>
        
        <div className="order-summary">
          <div className="summary-card">
            <h3 className="summary-title">Order Summary</h3>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${formatPrice(subtotal)}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `$${formatPrice(shipping)}`}</span>
            </div>
            
            <div className="summary-row">
              <span>Tax</span>
              <span>${formatPrice(tax)}</span>
            </div>
            
            {discount > 0 && (
              <div className="summary-row discount">
                <span>Discount</span>
                <span>-${formatPrice(discount)}</span>
              </div>
            )}
            
            <div className="summary-row total">
              <span>Total</span>
              <span>${formatPrice(total)}</span>
            </div>
            
            <div className="coupon-form">
              <form onSubmit={handleCouponSubmit}>
                <input
                  type="text"
                  placeholder="Coupon Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button type="submit">Apply</button>
              </form>
              {couponMessage && (
                <div className={`coupon-message ${couponMessage.type}`}>
                  {couponMessage.text}
                </div>
              )}
            </div>
            
            <div className="order-actions">
              <button 
                type="button" 
                className="btn-outline"
                onClick={onBack}
              >
                Back to Payment
              </button>
              <button 
                type="button" 
                className="btn-primary"
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder || cart.length === 0}
              >
                {isPlacingOrder ? 'Processing...' : 'Place Order'}
              </button>
            </div>
            
            <div className="order-disclaimer">
              <p>By placing your order, you agree to our Terms of Service and Privacy Policy. Your payment details are securely encrypted.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderReview;