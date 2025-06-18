import { useState, useEffect } from 'react';
import './ProductGallery.css';

// Mock function to generate additional images since the Fake Store API only provides one image
const generateAdditionalImages = (mainImage) => {
  if (!mainImage) return [];
  
  // Extract base URL and file extension
  const dotIndex = mainImage.lastIndexOf('.');
  const baseUrl = mainImage.substring(0, dotIndex);
  const extension = mainImage.substring(dotIndex);
  
  // Create variations by adding query parameters
  return [
    mainImage,
    `${baseUrl}?angle=front${extension}`,
    `${baseUrl}?angle=side${extension}`,
    `${baseUrl}?angle=back${extension}`,
    `${baseUrl}?angle=detail${extension}`
  ];
};

const ProductGallery = ({ product }) => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    if (product && product.image) {
      const allImages = generateAdditionalImages(product.image);
      setImages(allImages);
      setSelectedImage(0);
    }
  }, [product]);
  
  if (!product || !product.image || images.length === 0) {
    return <div className="gallery-loading">Loading gallery...</div>;
  }
  
  const handleMouseMove = (e) => {
    if (!zoomed) return;
    
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setMousePosition({ x, y });
  };
  
  const handleMouseEnter = () => {
    setZoomed(true);
  };
  
  const handleMouseLeave = () => {
    setZoomed(false);
  };
  
  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };
  
  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };
  
  return (
    <div className="product-gallery">
      <div className="thumbnail-container">
        {images.map((image, index) => (
          <div 
            key={index}
            className={`thumbnail ${index === selectedImage ? 'selected' : ''}`}
            onClick={() => setSelectedImage(index)}
          >
            <img src={image} alt={`${product.title} - Thumbnail ${index + 1}`} />
          </div>
        ))}
      </div>
      
      <div 
        className={`main-image-container ${zoomed ? 'zoomed' : ''}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img 
          className="main-image"
          src={images[selectedImage]} 
          alt={product.title} 
          style={zoomed ? {
            transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
          } : {}}
        />
        
        {/* Navigation arrows */}
        <button 
          className="gallery-nav prev" 
          onClick={prevImage}
          aria-label="Previous image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button 
          className="gallery-nav next" 
          onClick={nextImage}
          aria-label="Next image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
        
        {/* Zoom indicator */}
        {!zoomed && (
          <div className="zoom-indicator">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="11" y1="8" x2="11" y2="14"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
            <span>Hover to zoom</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGallery;