import { useState } from 'react';
import { Link } from 'react-router-dom';
import './OrderComplete.css';

const OrderComplete = ({ order }) => {
  const [emailSent, setEmailSent] = useState(false);
  
  const handleSendConfirmation = () => {
    // In a real app, this would call an API endpoint
    setEmailSent(true);
    
    // Reset after 5 seconds for demo purposes
    setTimeout(() => setEmailSent(false), 5000);
  };
  
  if (!order) {
    return (
      <div className="order-complete-container">
        <div className="order-complete-message">
          <h2>Order Processed</h2>
          <p>Your order has been processed successfully.</p>
          <div className="order-actions">
            <Link to="/" className="btn-primary">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const estimatedDelivery = () => {
    const deliveryDate = new Date(order.date);
    deliveryDate.setDate(deliveryDate.getDate() + 5); // 5 days for delivery
    return formatDate(deliveryDate);
  };
  
  return (
    <div className="order-complete-container">
      <div className="order-success">
        <div className="success-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h2>Order Placed Successfully!</h2>
        <p className="success-message">Thank you for your purchase. Your order has been received and is now being processed.</p>
      </div>
      
      <div className="order-details-summary">
        <div className="detail-row">
          <div className="detail-item">
            <h3>Order Number</h3>
            <p>{order.id}</p>
          </div>
          <div className="detail-item">
            <h3>Date</h3>
            <p>{formatDate(order.date)}</p>
          </div>
          <div className="detail-item">
            <h3>Total</h3>
            <p>${order.payment.total.toFixed(2)}</p>
          </div>
          <div className="detail-item">
            <h3>Payment Method</h3>
            <p>{order.payment.method === 'card' ? `Credit Card (ending in ${order.payment.cardLast4})` : 'PayPal'}</p>
          </div>
        </div>
      </div>
      
      <div className="shipping-info">
        <h3>Shipping Information</h3>
        <div className="shipping-details">
          <p><strong>{order.shipping.firstName} {order.shipping.lastName}</strong></p>
          <p>{order.shipping.address}</p>
          <p>{order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}</p>
          <p>{order.shipping.country}</p>
        </div>
        <div className="delivery-estimate">
          <h4>Estimated Delivery Date</h4>
          <p>{estimatedDelivery()}</p>
        </div>
      </div>
      
      <div className="order-items">
        <h3>Order Items</h3>
        <div className="items-container">
          {order.items.map(item => (
            <div key={item.id} className="order-item">
              <div className="item-image">
                <img src={item.image} alt={item.title} />
              </div>
              <div className="item-details">
                <h4>{item.title}</h4>
                <p className="item-price">${item.price.toFixed(2)} × {item.quantity}</p>
              </div>
              <div className="item-total">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="order-summary">
        <h3>Order Summary</h3>
        <div className="summary-details">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${order.payment.subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>${order.payment.shipping.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Tax</span>
            <span>${order.payment.tax.toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${order.payment.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className="confirmation-email">
        <p>A confirmation email has been sent to <strong>{order.customer.email}</strong>.</p>
        {!emailSent ? (
          <button 
            className="btn-outline"
            onClick={handleSendConfirmation}
          >
            Resend Confirmation Email
          </button>
        ) : (
          <div className="email-sent-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>Email sent successfully!</span>
          </div>
        )}
      </div>
      
      <div className="order-actions">
        <Link to="/account/orders" className="btn-outline">View My Orders</Link>
        <Link to="/" className="btn-primary">Continue Shopping</Link>
      </div>
      
      <div className="order-help">
        <h3>Need Help?</h3>
        <p>If you have any questions about your order, please <Link to="/contact">contact our support team</Link>.</p>
      </div>
    </div>
  );
};

export default OrderComplete;