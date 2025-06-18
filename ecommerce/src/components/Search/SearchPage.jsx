import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductList from '../ProductList';
import './SearchPage.css';

const SearchPage = ({ products, addToCart, openQuickView, openProductDetail, addToWishlist }) => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);

  useEffect(() => {
    if (!products || products.length === 0) return;

    setLoading(true);
    
    // Get all unique categories
    const uniqueCategories = [...new Set(products.map(product => product.category))];
    setCategories(uniqueCategories);
    
    // Find min and max prices
    const prices = products.map(product => product.price);
    setMinPrice(Math.floor(Math.min(...prices)));
    setMaxPrice(Math.ceil(Math.max(...prices)));
    
    // Set initial price range
    setPriceRange({ min: '', max: '' });
    
    // Reset selected categories
    setSelectedCategories([]);
    
    // Set sort by to relevance
    setSortBy('relevance');
    
    // Filter products based on search query
    filterProducts();
  }, [searchQuery, products]);

  useEffect(() => {
    filterProducts();
  }, [sortBy, priceRange, selectedCategories, searchQuery, products]);

  const filterProducts = () => {
    if (!products || products.length === 0) {
      setFilteredProducts([]);
      setLoading(false);
      return;
    }

    // Filter by search query
    let filtered = products.filter(product => {
      const titleMatch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
      const descriptionMatch = product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const categoryMatch = product.category && product.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      return titleMatch || descriptionMatch || categoryMatch;
    });
    
    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => 
        selectedCategories.includes(product.category)
      );
    }
    
    // Filter by price range
    if (priceRange.min !== '') {
      filtered = filtered.filter(product => product.price >= Number(priceRange.min));
    }
    
    if (priceRange.max !== '') {
      filtered = filtered.filter(product => product.price <= Number(priceRange.max));
    }
    
    // Sort products
    switch (sortBy) {
      case 'price-low-high':
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case 'name-a-z':
        filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-z-a':
        filtered = [...filtered].sort((a, b) => b.title.localeCompare(a.title));
        break;
      // For relevance, we'll keep the original order which is assumed to be by relevance
      case 'relevance':
      default:
        // We could implement a more sophisticated relevance algorithm here
        break;
    }
    
    setFilteredProducts(filtered);
    setLoading(false);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(cat => cat !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target;
    setPriceRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setPriceRange({ min: '', max: '' });
    setSortBy('relevance');
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>Search Results for "{searchQuery}"</h1>
        <div className="results-count">
          {loading ? 'Searching...' : `${filteredProducts.length} products found`}
        </div>
      </div>
      
      <div className="search-content">
        <aside className="search-filters">
          <div className="filter-section">
            <div className="filter-header">
              <h3>Filters</h3>
              <button 
                className="clear-filters"
                onClick={handleClearFilters}
                disabled={selectedCategories.length === 0 && !priceRange.min && !priceRange.max}
              >
                Clear All
              </button>
            </div>
            
            <div className="filter-group">
              <h4>Categories</h4>
              <div className="category-filters">
                {categories.map(category => (
                  <label key={category} className="category-checkbox">
                    <input 
                      type="checkbox" 
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                    />
                    <span className="checkbox-label">{category}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="filter-group">
              <h4>Price Range</h4>
              <div className="price-inputs">
                <div className="price-input">
                  <label htmlFor="min">Min ($)</label>
                  <input 
                    type="number" 
                    id="min"
                    name="min"
                    min={minPrice}
                    max={maxPrice}
                    value={priceRange.min}
                    onChange={handlePriceRangeChange}
                    placeholder={minPrice}
                  />
                </div>
                <div className="price-input">
                  <label htmlFor="max">Max ($)</label>
                  <input 
                    type="number" 
                    id="max"
                    name="max"
                    min={minPrice}
                    max={maxPrice}
                    value={priceRange.max}
                    onChange={handlePriceRangeChange}
                    placeholder={maxPrice}
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>
        
        <main className="search-results">
          <div className="results-header">
            <div className="sort-by">
              <label htmlFor="sort">Sort By:</label>
              <select 
                id="sort" 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="relevance">Relevance</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="name-a-z">Name: A to Z</option>
                <option value="name-z-a">Name: Z to A</option>
              </select>
            </div>
          </div>
          
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Searching for products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="no-results">
              <h2>No products found</h2>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <ProductList 
              products={filteredProducts}
              addToCart={addToCart}
              openQuickView={openQuickView}
              openProductDetail={openProductDetail}
              addToWishlist={addToWishlist}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default SearchPage;