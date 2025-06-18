import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

const SearchBar = ({ products, placeholder = "Search products..." }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (query.trim() === '') {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);
    
    // Simulate network request with setTimeout
    const timer = setTimeout(() => {
      const filtered = products.filter(product => 
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(query.toLowerCase())) ||
        (product.category && product.category.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 6); // Limit to 6 suggestions
      
      setSuggestions(filtered);
      setShowSuggestions(true);
      setLoading(false);
      setHighlightedIndex(-1);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, products]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() !== '') {
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleSuggestionClick = (productId) => {
    setShowSuggestions(false);
    setQuery('');
    navigate(`/product/${productId}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev);
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[highlightedIndex].id);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Highlight the matching part of the text
  const highlightMatch = (text, query) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  return (
    <div className="search-container" ref={searchRef}>
      <form onSubmit={handleSearch} className="search-form">
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() !== '' && setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          aria-label="Search products"
        />
        <button type="submit" className="search-button" aria-label="Search">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </form>
      
      {showSuggestions && (
        <div className="search-suggestions">
          {loading ? (
            <div className="search-loading">
              <div className="spinner"></div>
              <span>Searching...</span>
            </div>
          ) : suggestions.length > 0 ? (
            <ul className="suggestion-list">
              {suggestions.map((product, index) => (
                <li 
                  key={product.id}
                  className={`suggestion-item ${index === highlightedIndex ? 'highlighted' : ''}`}
                  onClick={() => handleSuggestionClick(product.id)}
                >
                  <div className="suggestion-image">
                    <img src={product.image} alt={product.title} />
                  </div>
                  <div className="suggestion-details">
                    <div 
                      className="suggestion-title"
                      dangerouslySetInnerHTML={{ 
                        __html: highlightMatch(product.title, query) 
                      }}
                    ></div>
                    <div className="suggestion-category">
                      {product.category}
                    </div>
                    <div className="suggestion-price">
                      ${product.price.toFixed(2)}
                    </div>
                  </div>
                </li>
              ))}
              <li className="suggestion-footer">
                <button onClick={handleSearch} className="view-all-results">
                  View all results
                </button>
              </li>
            </ul>
          ) : (
            <div className="no-suggestions">
              No products found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;