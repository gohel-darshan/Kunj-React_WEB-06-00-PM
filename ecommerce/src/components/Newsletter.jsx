import { useState } from 'react';
import './Newsletter.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  const handleSubscribe = (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setError('');
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubscribed(true);
    }, 1500);
  };
  
  return (
    <section className="newsletter-section">
      <div className="container">
        <div className="newsletter-container">
          <div className="newsletter-content">
            <div className="newsletter-icon">
              <div className="envelope">
                <div className="envelope-top"></div>
                <div className="envelope-body">
                  <div className="letter"></div>
                </div>
              </div>
            </div>
            
            <div className="newsletter-text">
              <h2>Subscribe to Our Newsletter</h2>
              <p>Get exclusive offers, latest trends, and product updates delivered to your inbox</p>
              
              {!subscribed ? (
                <form className="newsletter-form" onSubmit={handleSubscribe}>
                  <div className="form-group">
                    <input 
                      type="email" 
                      placeholder="Your email address" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={error ? 'error' : ''}
                    />
                    {error && <span className="error-message">{error}</span>}
                  </div>
                  
                  <button 
                    type="submit" 
                    className={`subscribe-btn ${loading ? 'loading' : ''}`}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="loading-dots">
                        <span>.</span><span>.</span><span>.</span>
                      </span>
                    ) : (
                      'Subscribe'
                    )}
                  </button>
                </form>
              ) : (
                <div className="success-message">
                  <div className="checkmark">✓</div>
                  <p>Thank you for subscribing!</p>
                  <p className="small">Keep an eye on your inbox for special offers and updates.</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="newsletter-perks">
            <div className="perk">
              <div className="perk-icon">🎁</div>
              <div className="perk-content">
                <h3>Exclusive Offers</h3>
                <p>Be the first to know about our special deals and promotions</p>
              </div>
            </div>
            
            <div className="perk">
              <div className="perk-icon">🚚</div>
              <div className="perk-content">
                <h3>Free Shipping</h3>
                <p>Get free shipping on orders over $50</p>
              </div>
            </div>
            
            <div className="perk">
              <div className="perk-icon">🔄</div>
              <div className="perk-content">
                <h3>Easy Returns</h3>
                <p>30-day money-back guarantee on all purchases</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;