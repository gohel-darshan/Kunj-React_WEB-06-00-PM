import { useState, useEffect } from 'react';
import './SaleCountdown.css';

const SaleCountdown = () => {
  // Set the sale end date to 7 days from now
  const [endDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date;
  });
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = endDate - new Date();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };
    
    // Initial calculation
    calculateTimeLeft();
    
    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, [endDate]);
  
  return (
    <div className="sale-countdown-container">
      <div className="sale-banner">
        <div className="sale-badge">Limited Time Offer</div>
        <h3 className="sale-title">Summer Sale</h3>
        <p className="sale-description">Up to 50% off on selected items</p>
        
        <div className="countdown-timer">
          <div className="countdown-unit">
            <div className="countdown-value">{timeLeft.days}</div>
            <div className="countdown-label">Days</div>
          </div>
          
          <div className="countdown-separator">:</div>
          
          <div className="countdown-unit">
            <div className="countdown-value">{timeLeft.hours.toString().padStart(2, '0')}</div>
            <div className="countdown-label">Hours</div>
          </div>
          
          <div className="countdown-separator">:</div>
          
          <div className="countdown-unit">
            <div className="countdown-value">{timeLeft.minutes.toString().padStart(2, '0')}</div>
            <div className="countdown-label">Minutes</div>
          </div>
          
          <div className="countdown-separator">:</div>
          
          <div className="countdown-unit">
            <div className="countdown-value">{timeLeft.seconds.toString().padStart(2, '0')}</div>
            <div className="countdown-label">Seconds</div>
          </div>
        </div>
        
        <button className="shop-now-btn">Shop Now</button>
      </div>
    </div>
  );
};

export default SaleCountdown;