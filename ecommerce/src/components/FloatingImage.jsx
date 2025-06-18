import { useEffect, useRef } from 'react';
import './FloatingImage.css';

const FloatingImage = ({ src, alt, delay = 0 }) => {
  const imageRef = useRef(null);
  
  useEffect(() => {
    const image = imageRef.current;
    if (!image) return;
    
    // Random starting position within constraints
    const startX = Math.random() * 30 - 15; // -15px to 15px
    const startY = Math.random() * 30 - 15; // -15px to 15px
    
    // Apply initial positioning
    image.style.transform = `translate(${startX}px, ${startY}px)`;
    
    // Add hover effect
    const handleMouseMove = (e) => {
      const { left, top, width, height } = image.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      
      // Calculate distance from pointer to center
      const distX = (e.clientX - centerX) / 15;
      const distY = (e.clientY - centerY) / 15;
      
      // Calculate rotation based on mouse position
      const rotateX = distY * -1; // Invert Y axis for natural feeling
      const rotateY = distX;
      
      // Apply transform
      image.style.transform = `translate(${startX}px, ${startY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };
    
    const handleMouseLeave = () => {
      // Return to starting position
      image.style.transform = `translate(${startX}px, ${startY}px) rotateX(0deg) rotateY(0deg)`;
    };
    
    // Apply floating animation
    image.style.animationDelay = `${delay}s`;
    
    // Add event listeners
    const parentContainer = image.parentElement;
    parentContainer.addEventListener('mousemove', handleMouseMove);
    parentContainer.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      parentContainer.removeEventListener('mousemove', handleMouseMove);
      parentContainer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [delay]);
  
  return (
    <div className="floating-image-container">
      <img ref={imageRef} src={src} alt={alt} className="floating-image" />
    </div>
  );
};

export default FloatingImage;