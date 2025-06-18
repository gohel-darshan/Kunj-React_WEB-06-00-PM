import { useState, useEffect } from 'react';
import './FeaturedCategories.css';

const FeaturedCategories = ({ setSelectedCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://fakestoreapi.com/products/categories');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setCategories(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch categories. Please try again later.');
        setLoading(false);
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);
  
  // Images for each category (in a real app, these would come from your backend)
  const categoryImages = {
    "electronics": "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZWxlY3Ryb25pY3N8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    "jewelery": "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8amV3ZWxyeXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    "men's clothing": "https://images.unsplash.com/photo-1516257984-b1b4d707412e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG1lbiUyMGNsb3RoaW5nfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    "women's clothing": "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8d29tZW4lMjBjbG90aGluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
  };
  
  // Category icons (using emoji as placeholders, you could use font-awesome or SVGs)
  const categoryIcons = {
    "electronics": "🔌",
    "jewelery": "💍",
    "men's clothing": "👔",
    "women's clothing": "👗"
  };
  
  if (loading) {
    return (
      <div className="featured-categories-section">
        <div className="container">
          <div className="section-heading">
            <h2>Categories</h2>
            <div className="loading-categories">Loading categories...</div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="featured-categories-section">
        <div className="container">
          <div className="section-heading">
            <h2>Categories</h2>
            <div className="error">{error}</div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <section className="featured-categories-section">
      <div className="container">
        <div className="section-heading">
          <h2>Shop by Category</h2>
          <p>Browse our featured categories and find what you need</p>
        </div>
        
        <div className="categories-grid">
          {categories.map((category, index) => (
            <div 
              key={category} 
              className="category-card"
              onClick={() => setSelectedCategory(category)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="category-image-container">
                <div className="category-icon">{categoryIcons[category]}</div>
                <img 
                  src={categoryImages[category]} 
                  alt={category} 
                  className="category-image" 
                />
                <div className="category-overlay">
                  <span className="view-products">View Products</span>
                </div>
              </div>
              <h3 className="category-name">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;