import { useState, useEffect } from 'react';
import ProductCard from '../ProductCard';
import './RelatedProducts.css';

const RelatedProducts = ({ 
  product, 
  products, 
  addToCart, 
  openQuickView,
  openProductDetail,
  addToWishlist
}) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  useEffect(() => {
    if (!product || !products || products.length === 0) return;
    
    // Find products in the same category
    const sameCategory = products.filter(p => 
      p.category === product.category && p.id !== product.id
    );
    
    // If we have enough products in the same category, use those
    if (sameCategory.length >= 4) {
      setRelatedProducts(sameCategory.slice(0, 4));
      return;
    }
    
    // Otherwise, add some other products to reach 4 items
    const otherProducts = products.filter(p => 
      p.category !== product.category && p.id !== product.id
    );
    
    const combined = [
      ...sameCategory,
      ...otherProducts.slice(0, 4 - sameCategory.length)
    ];
    
    setRelatedProducts(combined);
  }, [product, products]);
  
  if (relatedProducts.length === 0) {
    return null;
  }
  
  return (
    <div className="related-products">
      <h2 className="section-title">You Might Also Like</h2>
      
      <div className="related-products-container">
        {relatedProducts.map(product => (
          <ProductCard 
            key={product.id}
            product={product}
            addToCart={addToCart}
            openQuickView={openQuickView}
            openProductDetail={openProductDetail}
            addToWishlist={addToWishlist}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;