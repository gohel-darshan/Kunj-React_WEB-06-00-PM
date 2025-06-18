import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import './ProductList.css';

const ProductList = ({ products, addToCart, openQuickView, openProductDetail, addToWishlist, selectedCategory }) => {
  const [categories, setCategories] = useState([]);
  const [internalCategory, setInternalCategory] = useState(selectedCategory || 'all');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState('default');

  useEffect(() => {
    // Extract unique categories
    const uniqueCategories = [...new Set(products.map(product => product.category))];
    setCategories(uniqueCategories);
    
    // Initial filtering
    filterProducts(selectedCategory, sortOption);
  }, [products]);

  useEffect(() => {
    filterProducts(selectedCategory, sortOption);
  }, [selectedCategory, sortOption, products]);

  const filterProducts = (category, sort) => {
    let filtered = [...products];
    
    // Filter by category
    if (category !== 'all') {
      filtered = filtered.filter(product => product.category === category);
    }
    
    // Sort products
    switch (sort) {
      case 'price-low-to-high':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-to-low':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      default:
        // Default sorting (by id)
        filtered.sort((a, b) => a.id - b.id);
    }
    
    setFilteredProducts(filtered);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <div className="product-list-container">
      <div className="product-list-header">
        <h2 className="section-title">Our Products</h2>
        
        <div className="filters">
          <div className="filter-group">
            <label htmlFor="category-filter">Category:</label>
            <select 
              id="category-filter" 
              value={selectedCategory} 
              onChange={handleCategoryChange}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="sort-filter">Sort By:</label>
            <select 
              id="sort-filter" 
              value={sortOption} 
              onChange={handleSortChange}
              className="filter-select"
            >
              <option value="default">Default</option>
              <option value="price-low-to-high">Price: Low to High</option>
              <option value="price-high-to-low">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="product-count">
        Showing {filteredProducts.length} products
      </div>
      
      <div className="product-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-grid-item">
            <ProductCard product={product} addToCart={addToCart} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;