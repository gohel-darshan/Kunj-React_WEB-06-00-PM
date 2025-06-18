import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';
import RelatedProducts from './RelatedProducts';
import ProductReviews from './ProductReviews';
import SocialShare from '../SocialShare';
import './ProductDetailPage.css';

const ProductDetailPage = ({ 
  products, 
  addToCart, 
  addToWishlist, 
  openQuickView, 
  openProductDetail 
}) => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // For breadcrumbs
  const [category, setCategory] = useState('');
  
  useEffect(() => {
    if (!productId) {
      setError('Product ID is missing');
      setLoading(false);
      return;
    }
    
    // First check if product is in the products array
    if (products && products.length > 0) {
      const foundProduct = products.find(p => p.id.toString() === productId);
      
      if (foundProduct) {
        setProduct(foundProduct);
        setCategory(foundProduct.category);
        setLoading(false);
        return;
      }
    }
    
    // Otherwise, fetch the product from the API
    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setProduct(data);
        setCategory(data.category);
        setLoading(false);
      } catch (err) {
        setError('Failed to load product. Please try again later.');
        setLoading(false);
        console.error('Error fetching product:', err);
      }
    };
    
    fetchProduct();
  }, [productId, products]);
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="product-detail-error">
        <h2>Oops! Something went wrong</h2>
        <p>{error || 'Product not found'}</p>
        <button className="btn-back" onClick={handleGoBack}>
          Go Back
        </button>
      </div>
    );
  }
  
  return (
    <div className="product-detail-page">
      <div className="breadcrumbs">
        <Link to="/">Home</Link>
        <span className="breadcrumb-separator">/</span>
        <Link to={`/category/${category}`}>{category}</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="current">{product.title}</span>
      </div>
      
      <div className="product-main">
        <div className="product-gallery-container">
          <ProductGallery product={product} />
        </div>
        
        <div className="product-info-container">
          <ProductInfo 
            product={product} 
            addToCart={addToCart}
            addToWishlist={addToWishlist}
          />
          
          <div className="product-share">
            <SocialShare 
              title={product.title} 
              url={window.location.href} 
            />
          </div>
        </div>
      </div>
      
      <ProductReviews product={product} />
      
      <RelatedProducts 
        product={product}
        products={products}
        addToCart={addToCart}
        openQuickView={openQuickView}
        openProductDetail={openProductDetail}
        addToWishlist={addToWishlist}
      />
    </div>
  );
};

export default ProductDetailPage;