import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import ParticlesBackground from './components/ParticlesBackground';
import CustomCursor from './components/CustomCursor';
import DarkModeToggle from './components/DarkModeToggle';
import Newsletter from './components/Newsletter';
import FeaturedCategories from './components/FeaturedCategories';
import ProductDetail from './components/ProductDetail';
import QuickView from './components/QuickView';
import Testimonials from './components/Testimonials';
import Wishlist from './components/Wishlist';
import SaleCountdown from './components/SaleCountdown';
import './App.css';

const App = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [showWishlist, setShowWishlist] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://fakestoreapi.com/products');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch products. Please try again later.');
        setLoading(false);
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCart(cart.map(item => 
      item.id === productId 
        ? { ...item, quantity: newQuantity } 
        : item
    ));
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  // Function to open product detail
  const openProductDetail = (productId) => {
    setSelectedProduct(productId);
  };
  
  // Function to close product detail
  const closeProductDetail = () => {
    setSelectedProduct(null);
  };
  
  // Function to open quick view
  const openQuickView = (productId) => {
    setQuickViewProduct(productId);
  };
  
  // Function to close quick view
  const closeQuickView = () => {
    setQuickViewProduct(null);
  };
  
  // Function to toggle wishlist
  const toggleWishlist = () => {
    setShowWishlist(!showWishlist);
  };
  
  // Function to add to wishlist
  const addToWishlist = (product) => {
    // Get current wishlist from localStorage
    const savedWishlist = localStorage.getItem('wishlist');
    let wishlist = savedWishlist ? JSON.parse(savedWishlist) : [];
    
    // Check if product is already in wishlist
    if (!wishlist.some(item => item.id === product.id)) {
      wishlist.push(product);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
    
    // Show a notification or feedback
    alert('Product added to wishlist!');
  };

  return (
    <div className="app">
      <CustomCursor />
      <ParticlesBackground />
      <DarkModeToggle />
      <Navbar 
        cartCount={getTotalItems()} 
        toggleCart={toggleCart} 
        toggleWishlist={toggleWishlist}
      />
      
      <div className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Welcome to <span className="highlight">ShopEasy</span></h1>
            <p className="hero-subtitle">Discover amazing products at incredible prices</p>
            <button className="btn btn-hero">Shop Now</button>
          </div>
        </div>
      </div>
      
      <main className="main-content">
        <div className="container">
          <SaleCountdown />
          
          <FeaturedCategories setSelectedCategory={setSelectedCategory} />
          
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading amazing products for you...</p>
            </div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            <ProductList 
              products={products} 
              addToCart={addToCart} 
              openQuickView={openQuickView}
              openProductDetail={openProductDetail}
              addToWishlist={addToWishlist}
              selectedCategory={selectedCategory}
            />
          )}
          
          <Testimonials />
          
          <Newsletter />
        </div>
      </main>
      
      {showCart && (
        <Cart 
          cartItems={cart} 
          removeFromCart={removeFromCart} 
          updateQuantity={updateQuantity}
          toggleCart={toggleCart}
        />
      )}
      
      {showWishlist && (
        <Wishlist 
          closeWishlist={toggleWishlist}
          addToCart={addToCart}
        />
      )}
      
      {selectedProduct && (
        <ProductDetail 
          productId={selectedProduct} 
          addToCart={addToCart}
          closeDetail={closeProductDetail}
        />
      )}
      
      {quickViewProduct && (
        <QuickView 
          productId={quickViewProduct} 
          addToCart={addToCart}
          closeQuickView={closeQuickView}
        />
      )}
    </div>
  );
};

export default App;