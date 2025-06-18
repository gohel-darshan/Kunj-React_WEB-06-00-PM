import { useState, useEffect, useRef } from 'react';
import './Testimonials.css';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const slideIntervalRef = useRef(null);
  
  // Sample testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      position: "Fashion Blogger",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      text: "I've been shopping with ShopEasy for over a year now and I'm consistently impressed by the quality of products and the exceptional customer service. The website is intuitive and makes finding what I need a breeze.",
      rating: 5
    },
    {
      id: 2,
      name: "Michael Chen",
      position: "Tech Enthusiast",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      text: "As someone who's always looking for the latest gadgets, I appreciate ShopEasy's diverse electronics section. The prices are competitive and shipping is always prompt. Highly recommend!",
      rating: 4
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      position: "Interior Designer",
      image: "https://randomuser.me/api/portraits/women/63.jpg",
      text: "The home decor items I've purchased from ShopEasy have exceeded my expectations. The detailed product descriptions and high-quality images make online shopping a pleasure. Will definitely be a repeat customer!",
      rating: 5
    }
  ];
  
  // Auto-slide functionality
  useEffect(() => {
    slideIntervalRef.current = setInterval(() => {
      setActiveIndex(prevIndex => (prevIndex + 1) % testimonials.length);
    }, 5000);
    
    return () => {
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
      }
    };
  }, [testimonials.length]);
  
  // Reset interval when manually changing slides
  const handleDotClick = (index) => {
    setActiveIndex(index);
    
    if (slideIntervalRef.current) {
      clearInterval(slideIntervalRef.current);
      slideIntervalRef.current = setInterval(() => {
        setActiveIndex(prevIndex => (prevIndex + 1) % testimonials.length);
      }, 5000);
    }
  };
  
  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="section-heading">
          <h2>What Our Customers Say</h2>
          <p>Don't just take our word for it — hear from our satisfied customers</p>
        </div>
        
        <div className="testimonials-container">
          <div className="testimonials-wrapper" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial">
                <div className="testimonial-content">
                  <div className="quote-icon">❝</div>
                  <p className="testimonial-text">{testimonial.text}</p>
                  <div className="testimonial-rating">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < testimonial.rating ? 'star filled' : 'star'}>★</span>
                    ))}
                  </div>
                </div>
                
                <div className="testimonial-author">
                  <div className="author-image">
                    <img src={testimonial.image} alt={testimonial.name} />
                  </div>
                  <div className="author-info">
                    <h4 className="author-name">{testimonial.name}</h4>
                    <p className="author-position">{testimonial.position}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="testimonial-dots">
            {testimonials.map((_, index) => (
              <button 
                key={index} 
                className={`dot ${index === activeIndex ? 'active' : ''}`}
                onClick={() => handleDotClick(index)}
              />
            ))}
          </div>
          
          <button 
            className="testimonial-arrow prev"
            onClick={() => handleDotClick((activeIndex - 1 + testimonials.length) % testimonials.length)}
          >
            &#10094;
          </button>
          <button 
            className="testimonial-arrow next"
            onClick={() => handleDotClick((activeIndex + 1) % testimonials.length)}
          >
            &#10095;
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;