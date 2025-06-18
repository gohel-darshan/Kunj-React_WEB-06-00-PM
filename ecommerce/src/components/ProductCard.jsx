import './ProductCard.css';

const ProductCard = ({ product, addToCart }) => {
  const { id, title, price, description, category, image, rating } = product;

  return (
    <div className="product-card">
      <div className="product-badge">
        {rating && rating.rate >= 4.5 ? <span className="badge top-rated">Top Rated</span> : null}
        {Math.random() > 0.7 ? <span className="badge sale">Sale</span> : null}
      </div>
      
      <div className="product-img">
        <img src={image} alt={title} />
      </div>
      
      <div className="product-info">
        <div className="product-category">{category}</div>
        <h3 className="product-title">{title}</h3>
        
        <div className="product-rating">
          {rating && (
            <>
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.round(rating.rate) ? 'star filled' : 'star'}>
                    ★
                  </span>
                ))}
              </div>
              <span className="rating-count">({rating.count})</span>
            </>
          )}
        </div>
        
        <div className="product-description">
          {description.length > 100 ? `${description.substring(0, 100)}...` : description}
        </div>
        
        <div className="product-bottom">
          <div className="product-price">${price.toFixed(2)}</div>
          <button 
            className="btn btn-primary add-to-cart"
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;