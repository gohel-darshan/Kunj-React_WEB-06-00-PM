import { useState } from 'react';
import './PaymentForm.css';

const PaymentForm = ({ onSubmit, onBack }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState({});
  
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setErrors({});
  };
  
  const formatCardNumber = (value) => {
    // Remove non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format with spaces every 4 digits
    let formatted = '';
    for (let i = 0; i < digits.length; i += 4) {
      formatted += digits.slice(i, i + 4) + ' ';
    }
    
    return formatted.trim();
  };
  
  const formatExpiry = (value) => {
    // Remove non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format as MM/YY
    if (digits.length <= 2) {
      return digits;
    } else {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    }
  };
  
  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setCardNumber(formatted);
    }
    
    if (errors.cardNumber) {
      setErrors({
        ...errors,
        cardNumber: ''
      });
    }
  };
  
  const handleExpiryChange = (e) => {
    const formatted = formatExpiry(e.target.value);
    if (formatted.length <= 5) {
      setExpiry(formatted);
    }
    
    if (errors.expiry) {
      setErrors({
        ...errors,
        expiry: ''
      });
    }
  };
  
  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setCvv(value);
    }
    
    if (errors.cvv) {
      setErrors({
        ...errors,
        cvv: ''
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (paymentMethod === 'card') {
      // Card number validation (basic)
      const cardDigits = cardNumber.replace(/\s/g, '');
      if (!cardDigits) {
        newErrors.cardNumber = 'Card number is required';
      } else if (cardDigits.length < 16) {
        newErrors.cardNumber = 'Card number must be 16 digits';
      }
      
      // Card name validation
      if (!cardName.trim()) {
        newErrors.cardName = 'Name on card is required';
      }
      
      // Expiry validation
      if (!expiry) {
        newErrors.expiry = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        newErrors.expiry = 'Invalid format (MM/YY)';
      } else {
        const [month, year] = expiry.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;
        
        if (parseInt(month) < 1 || parseInt(month) > 12) {
          newErrors.expiry = 'Invalid month';
        } else if (
          parseInt(year) < currentYear || 
          (parseInt(year) === currentYear && parseInt(month) < currentMonth)
        ) {
          newErrors.expiry = 'Card has expired';
        }
      }
      
      // CVV validation
      if (!cvv) {
        newErrors.cvv = 'CVV is required';
      } else if (cvv.length < 3) {
        newErrors.cvv = 'CVV must be 3-4 digits';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        paymentMethod,
        ...(paymentMethod === 'card' && {
          cardNumber: cardNumber.replace(/\s/g, ''),
          cardName,
          expiry,
          cvv
        })
      });
    }
  };
  
  const getCardType = (number) => {
    const firstDigit = number.replace(/\s/g, '').charAt(0);
    
    if (firstDigit === '4') return 'visa';
    if (firstDigit === '5') return 'mastercard';
    if (firstDigit === '3') return 'amex';
    if (firstDigit === '6') return 'discover';
    
    return null;
  };
  
  const cardType = getCardType(cardNumber);
  
  return (
    <div className="payment-form-container">
      <h2 className="form-title">Payment Method</h2>
      
      <div className="payment-methods">
        <div 
          className={`payment-method ${paymentMethod === 'card' ? 'selected' : ''}`}
          onClick={() => handlePaymentMethodChange('card')}
        >
          <div className="payment-method-radio">
            <input 
              type="radio" 
              checked={paymentMethod === 'card'} 
              onChange={() => handlePaymentMethodChange('card')}
            />
          </div>
          <div className="payment-method-content">
            <h3>Credit Card</h3>
            <div className="card-types">
              <span className="card-type">Visa</span>
              <span className="card-type">Mastercard</span>
              <span className="card-type">Amex</span>
              <span className="card-type">Discover</span>
            </div>
          </div>
        </div>
        
        <div 
          className={`payment-method ${paymentMethod === 'paypal' ? 'selected' : ''}`}
          onClick={() => handlePaymentMethodChange('paypal')}
        >
          <div className="payment-method-radio">
            <input 
              type="radio" 
              checked={paymentMethod === 'paypal'} 
              onChange={() => handlePaymentMethodChange('paypal')}
            />
          </div>
          <div className="payment-method-content">
            <h3>PayPal</h3>
            <p>You will be redirected to PayPal to complete your payment securely.</p>
          </div>
        </div>
      </div>
      
      {paymentMethod === 'card' && (
        <form className="card-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="cardNumber">Card Number*</label>
            <div className={`card-number-input ${errors.cardNumber ? 'error' : ''}`}>
              <input
                type="text"
                id="cardNumber"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
              />
              {cardType && (
                <div className="card-type-icon">
                  {cardType}
                </div>
              )}
            </div>
            {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="cardName">Name on Card*</label>
            <input
              type="text"
              id="cardName"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="John Doe"
              className={errors.cardName ? 'error' : ''}
            />
            {errors.cardName && <span className="error-message">{errors.cardName}</span>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expiry">Expiry Date*</label>
              <input
                type="text"
                id="expiry"
                value={expiry}
                onChange={handleExpiryChange}
                placeholder="MM/YY"
                className={errors.expiry ? 'error' : ''}
              />
              {errors.expiry && <span className="error-message">{errors.expiry}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="cvv">CVV*</label>
              <input
                type="text"
                id="cvv"
                value={cvv}
                onChange={handleCvvChange}
                placeholder="123"
                className={errors.cvv ? 'error' : ''}
              />
              {errors.cvv && <span className="error-message">{errors.cvv}</span>}
            </div>
          </div>
        </form>
      )}
      
      {paymentMethod === 'paypal' && (
        <div className="paypal-info">
          <p>Click "Continue to Review" to proceed to PayPal. You will be able to review your order before completing the payment.</p>
        </div>
      )}
      
      <div className="form-actions">
        <button type="button" className="btn-outline" onClick={onBack}>
          Back to Shipping
        </button>
        <button type="button" className="btn-primary" onClick={handleSubmit}>
          Continue to Review
        </button>
      </div>
    </div>
  );
};

export default PaymentForm;