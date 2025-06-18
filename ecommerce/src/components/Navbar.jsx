import { useState } from 'react';
import './Navbar.css';

const Navbar = ({ cartCount }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="container navbar-container">
        <div className="logo">
          <h1>ShopEasy</h1>
        </div>
        
        <div className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          <span className={menuOpen ? 'open' : ''}></span>
          <span className={menuOpen ? 'open' : ''}></span>
          <span className={menuOpen ? 'open' : ''}></span>
        </div>
        
        <nav className={`nav-menu ${menuOpen ? 'open' : ''}`}>
          <ul>
            <li><a href="#" className="active">Home</a></li>
            <li><a href="#">Products</a></li>
            <li><a href="#">Categories</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </nav>
        
        <div className="nav-right">
          <div className="search-box">
            <input type="text" placeholder="Search products..." />
            <button className="search-btn">
              <i className="fa fa-search">🔍</i>
            </button>
          </div>
          
          <div className="cart-icon">
            <span className="cart-count">{cartCount}</span>
            <i className="fa fa-shopping-cart">🛒</i>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;