import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from './CheckoutSteps';
import ShippingForm from './ShippingForm';
import PaymentForm from './PaymentForm';
import OrderReview from './OrderReview';
import OrderComplete from './OrderComplete';
import { getCurrentUser } from '../../services/auth';
import './CheckoutPage.css';

const CheckoutPage = ({ cart, removeFromCart, updateQuantity, clearCart }) => {
  const [activeStep, setActiveStep] = useState(1);
  const [steps, setSteps] = useState([
    { id: 1, name: 'Shipping' },
    { id: 2, name: 'Payment' },
    { id: 3, name: 'Review' },
    { id: 4, name: 'Complete' }
  ]);
  const [shippingInfo, setShippingInfo] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [orderInfo, setOrderInfo] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to cart if cart is empty
    if (!cart || cart.length === 0) {
      navigate('/cart');
      return;
    }
    
    // Get current user if available
    const currentUser = getCurrentUser();
    setUser(currentUser);
    
    // Pre-fill shipping info if user has a default address
    if (currentUser && currentUser.addresses && currentUser.addresses.length > 0) {
      const defaultAddress = currentUser.addresses.find(addr => addr.isDefault) || currentUser.addresses[0];
      
      setShippingInfo({
        firstName: defaultAddress.name.split(' ')[0] || '',
        lastName: defaultAddress.name.split(' ').slice(1).join(' ') || '',
        email: currentUser.email,
        phone: defaultAddress.phone || '',
        address: defaultAddress.street,
        city: defaultAddress.city,
        state: defaultAddress.state,
        zipCode: defaultAddress.zipCode,
        country: defaultAddress.country,
        saveAddress: false
      });
    }
  }, [cart, navigate]);
  
  const handleNextStep = () => {
    setActiveStep(prevStep => prevStep + 1);
  };
  
  const handlePrevStep = () => {
    setActiveStep(prevStep => prevStep - 1);
  };
  
  const handleShippingSubmit = (data) => {
    setShippingInfo(data);
    handleNextStep();
  };
  
  const handlePaymentSubmit = (data) => {
    setPaymentInfo(data);
    handleNextStep();
  };
  
  const handleOrderSubmit = async () => {
    try {
      // Calculate total
      const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const shipping = subtotal > 50 ? 0 : 5.99;
      const tax = subtotal * 0.08; // 8% tax rate
      const total = subtotal + shipping + tax;
      
      // Create order object
      const order = {
        id: `ORD-${Date.now()}`,
        date: new Date().toISOString(),
        items: cart,
        customer: {
          id: user ? user.id : 'guest',
          name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
          email: shippingInfo.email
        },
        shipping: shippingInfo,
        payment: {
          method: paymentInfo.paymentMethod,
          // Only include last 4 digits of card number for security
          cardLast4: paymentInfo.paymentMethod === 'card' ? paymentInfo.cardNumber.slice(-4) : null,
          subtotal,
          shipping,
          tax,
          total
        },
        status: 'Processing'
      };
      
      // In a real app, you would send this to your backend API
      // For this demo, we'll just store it locally
      const savedOrders = localStorage.getItem('orders');
      const orders = savedOrders ? JSON.parse(savedOrders) : [];
      orders.push(order);
      localStorage.setItem('orders', JSON.stringify(orders));
      
      // Save order info for the completion step
      setOrderInfo(order);
      
      // Update user's loyalty points (10 points per dollar spent)
      if (user) {
        const pointsEarned = Math.floor(total * 10);
        // This would be handled by your backend in a real app
        console.log(`User earned ${pointsEarned} points`);
      }
      
      // Clear the cart
      clearCart();
      
      // Move to the completion step
      handleNextStep();
    } catch (error) {
      console.error('Error processing order:', error);
      alert('There was an error processing your order. Please try again.');
    }
  };
  
  // Render different step content based on activeStep
  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <ShippingForm 
            initialValues={shippingInfo} 
            onSubmit={handleShippingSubmit} 
            user={user}
          />
        );
      case 2:
        return (
          <PaymentForm 
            onSubmit={handlePaymentSubmit} 
            onBack={handlePrevStep}
          />
        );
      case 3:
        return (
          <OrderReview 
            cart={cart}
            shippingInfo={shippingInfo}
            paymentInfo={paymentInfo}
            onBack={handlePrevStep}
            onSubmit={handleOrderSubmit}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
          />
        );
      case 4:
        return (
          <OrderComplete order={orderInfo} />
        );
      default:
        return null;
    }
  };
  
  if (!cart || cart.length === 0) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1 className="checkout-title">Checkout</h1>
        
        <CheckoutSteps steps={steps} activeStep={activeStep} />
        
        <div className="checkout-content">
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;