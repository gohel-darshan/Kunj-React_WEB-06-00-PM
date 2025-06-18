import { useState } from 'react';
import './ProductReviews.css';

// Mock reviews data
const generateMockReviews = (productId, rating) => {
  const count = rating ? rating.count : 0;
  const avgRating = rating ? rating.rate : 0;
  
  // Generate a random number of reviews (up to the count from the API)
  const numReviews = Math.min(count, Math.floor(Math.random() * 10) + 3);
  
  const reviews = [];
  for (let i = 0; i < numReviews; i++) {
    // Generate a rating that's close to the average
    let reviewRating = Math.min(5, Math.max(1, Math.round(
      avgRating + (Math.random() * 2 - 1)
    )));
    
    // Generate a random date within the last year
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 365));
    
    reviews.push({
      id: `review-${productId}-${i}`,
      author: `User${Math.floor(Math.random() * 1000)}`,
      rating: reviewRating,
      date: date.toISOString(),
      title: getRandomTitle(reviewRating),
      content: getRandomContent(reviewRating),
      helpful: Math.floor(Math.random() * 50),
      verified: Math.random() > 0.3, // 70% chance of being a verified purchase
    });
  }
  
  return reviews;
};

// Helper functions to generate random review content
const getRandomTitle = (rating) => {
  const positiveTitles = [
    'Great product!', 
    'Highly recommend!',
    'Exceeded expectations', 
    'Worth every penny',
    'Excellent quality',
    'Very satisfied'
  ];
  
  const neutralTitles = [
    'Decent product', 
    'Good for the price',
    'As expected', 
    'Not bad',
    'Pretty good'
  ];
  
  const negativeTitles = [
    'Disappointed', 
    'Not worth it',
    'Save your money', 
    'Had issues',
    'Wouldn\'t recommend'
  ];
  
  if (rating >= 4) {
    return positiveTitles[Math.floor(Math.random() * positiveTitles.length)];
  } else if (rating >= 3) {
    return neutralTitles[Math.floor(Math.random() * neutralTitles.length)];
  } else {
    return negativeTitles[Math.floor(Math.random() * negativeTitles.length)];
  }
};

const getRandomContent = (rating) => {
  const positiveContent = [
    'I absolutely love this product! The quality is exceptional and it works exactly as described. Would definitely buy again.',
    'This exceeded my expectations in every way. Fast shipping, great packaging, and the product is perfect.',
    'One of the best purchases I\'ve made. Great value for the price and excellent quality.',
    'Very impressed with this product. It\'s well-made, looks great, and functions perfectly.',
    'Five stars all the way. This product has made my life easier and I use it every day.'
  ];
  
  const neutralContent = [
    'This product is decent for the price. Not amazing, but it gets the job done.',
    'It\'s pretty much what I expected. Nothing extraordinary, but no major issues either.',
    'Good product overall. There are a few minor issues, but nothing deal-breaking.',
    'Works as advertised. Not the highest quality, but good value for the price.',
    'Middle-of-the-road product. Some pros, some cons, but generally satisfactory.'
  ];
  
  const negativeContent = [
    'I regret this purchase. The quality is much lower than expected and it didn\'t work properly.',
    'Save your money and look elsewhere. This product has multiple issues and isn\'t worth the price.',
    'Disappointed with this purchase. The product arrived damaged and customer service was unhelpful.',
    'This doesn\'t work as advertised. Feels cheaply made and has already started to break.',
    'Would not recommend to anyone. Had nothing but problems since I received it.'
  ];
  
  if (rating >= 4) {
    return positiveContent[Math.floor(Math.random() * positiveContent.length)];
  } else if (rating >= 3) {
    return neutralContent[Math.floor(Math.random() * neutralContent.length)];
  } else {
    return negativeContent[Math.floor(Math.random() * negativeContent.length)];
  }
};

const ReviewItem = ({ review, onHelpfulClick }) => {
  const [voted, setVoted] = useState(false);
  
  const handleHelpfulClick = () => {
    if (!voted) {
      setVoted(true);
      onHelpfulClick(review.id);
    }
  };
  
  return (
    <div className="review-item">
      <div className="review-header">
        <div className="reviewer-info">
          <div className="reviewer-name">{review.author}</div>
          {review.verified && (
            <span className="verified-badge">Verified Purchase</span>
          )}
        </div>
        <div className="review-date">
          {new Date(review.date).toLocaleDateString()}
        </div>
      </div>
      
      <div className="review-rating">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < review.rating ? 'star filled' : 'star'}>★</span>
        ))}
      </div>
      
      <h3 className="review-title">{review.title}</h3>
      <div className="review-content">{review.content}</div>
      
      <div className="review-footer">
        <button 
          className={`helpful-button ${voted ? 'voted' : ''}`}
          onClick={handleHelpfulClick}
          disabled={voted}
        >
          {voted ? 'Marked as helpful' : 'Was this helpful?'}
        </button>
        <span className="helpful-count">
          {review.helpful + (voted ? 1 : 0)} people found this helpful
        </span>
      </div>
    </div>
  );
};

const RatingBreakdown = ({ reviews }) => {
  // Calculate rating counts
  const counts = Array(5).fill(0);
  reviews.forEach(review => {
    counts[review.rating - 1]++;
  });
  
  // Calculate percentages
  const percentages = counts.map(count => 
    reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0
  );
  
  // Calculate average rating
  const average = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;
  
  return (
    <div className="rating-breakdown">
      <div className="average-rating">
        <div className="average-value">{average.toFixed(1)}</div>
        <div className="rating-stars">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={i < Math.round(average) ? 'star filled' : 'star'}>★</span>
          ))}
        </div>
        <div className="rating-count">{reviews.length} reviews</div>
      </div>
      
      <div className="rating-bars">
        {[5, 4, 3, 2, 1].map(rating => (
          <div key={rating} className="rating-bar-item">
            <div className="bar-label">{rating} stars</div>
            <div className="bar-container">
              <div 
                className="bar-fill"
                style={{ width: `${percentages[rating - 1]}%` }}
              ></div>
            </div>
            <div className="bar-percentage">{percentages[rating - 1]}%</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ReviewForm = ({ onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [errors, setErrors] = useState({});
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    if (rating === 0) newErrors.rating = 'Please select a rating';
    if (!title.trim()) newErrors.title = 'Please enter a title';
    if (!content.trim()) newErrors.content = 'Please enter a review';
    if (!name.trim()) newErrors.name = 'Please enter your name';
    if (!email.trim()) newErrors.email = 'Please enter your email';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Create review object
    const review = {
      id: `review-new-${Date.now()}`,
      author: name,
      rating,
      date: new Date().toISOString(),
      title,
      content,
      helpful: 0,
      verified: false,
    };
    
    onSubmit(review);
    
    // Reset form
    setRating(0);
    setTitle('');
    setContent('');
    setName('');
    setEmail('');
    setErrors({});
  };
  
  return (
    <div className="review-form-container">
      <h3>Write a Review</h3>
      
      <form className="review-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Your Rating*</label>
          <div 
            className="rating-selector"
            onMouseLeave={() => setHoveredRating(0)}
          >
            {[1, 2, 3, 4, 5].map(value => (
              <span
                key={value}
                className={`rating-star ${value <= (hoveredRating || rating) ? 'active' : ''}`}
                onMouseEnter={() => setHoveredRating(value)}
                onClick={() => setRating(value)}
              >
                ★
              </span>
            ))}
          </div>
          {errors.rating && <div className="form-error">{errors.rating}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="review-title">Review Title*</label>
          <input
            type="text"
            id="review-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summarize your experience"
          />
          {errors.title && <div className="form-error">{errors.title}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="review-content">Review*</label>
          <textarea
            id="review-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What did you like or dislike about this product?"
            rows="5"
          ></textarea>
          {errors.content && <div className="form-error">{errors.content}</div>}
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="reviewer-name">Your Name*</label>
            <input
              type="text"
              id="reviewer-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="reviewer-email">Your Email*</label>
            <input
              type="email"
              id="reviewer-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>
        </div>
        
        <button type="submit" className="submit-review-btn">
          Submit Review
        </button>
      </form>
    </div>
  );
};

const ProductReviews = ({ product }) => {
  const [reviews, setReviews] = useState(() => 
    generateMockReviews(product.id, product.rating)
  );
  const [sortBy, setSortBy] = useState('recent');
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  const handleHelpfulClick = (reviewId) => {
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { ...review, helpful: review.helpful + 1 }
        : review
    ));
  };
  
  const handleAddReview = (newReview) => {
    setReviews([newReview, ...reviews]);
    setShowReviewForm(false);
    
    // Show thank you message
    alert('Thank you for your review!');
  };
  
  const getSortedReviews = () => {
    switch (sortBy) {
      case 'recent':
        return [...reviews].sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
      case 'helpful':
        return [...reviews].sort((a, b) => b.helpful - a.helpful);
      case 'highest':
        return [...reviews].sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return [...reviews].sort((a, b) => a.rating - b.rating);
      default:
        return reviews;
    }
  };
  
  const sortedReviews = getSortedReviews();
  
  return (
    <div className="product-reviews">
      <h2 className="section-title">Customer Reviews</h2>
      
      <div className="reviews-container">
        <div className="reviews-summary">
          <RatingBreakdown reviews={reviews} />
          
          <div className="reviews-actions">
            <button 
              className="write-review-btn"
              onClick={() => setShowReviewForm(!showReviewForm)}
            >
              {showReviewForm ? 'Cancel' : 'Write a Review'}
            </button>
          </div>
        </div>
        
        {showReviewForm && (
          <ReviewForm onSubmit={handleAddReview} />
        )}
        
        <div className="reviews-list-container">
          <div className="reviews-header">
            <h3>{reviews.length} Reviews</h3>
            <div className="reviews-sort">
              <label htmlFor="sort-reviews">Sort by:</label>
              <select 
                id="sort-reviews"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recent">Most Recent</option>
                <option value="helpful">Most Helpful</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
              </select>
            </div>
          </div>
          
          <div className="reviews-list">
            {sortedReviews.length > 0 ? (
              sortedReviews.map(review => (
                <ReviewItem 
                  key={review.id}
                  review={review}
                  onHelpfulClick={handleHelpfulClick}
                />
              ))
            ) : (
              <div className="no-reviews">
                <p>This product has no reviews yet. Be the first to leave a review!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;