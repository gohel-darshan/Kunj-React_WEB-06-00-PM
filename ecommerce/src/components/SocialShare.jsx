import { useState } from 'react';
import './SocialShare.css';

const SocialShare = ({ product }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Function to generate share URLs
  const getShareUrl = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(product.title);
    const description = encodeURIComponent(`Check out this product: ${product.title}`);
    const image = encodeURIComponent(product.image);
    
    switch (platform) {
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      case 'twitter':
        return `https://twitter.com/intent/tweet?url=${url}&text=${description}`;
      case 'pinterest':
        return `https://pinterest.com/pin/create/button/?url=${url}&media=${image}&description=${description}`;
      case 'linkedin':
        return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
      case 'whatsapp':
        return `https://api.whatsapp.com/send?text=${description}%20${url}`;
      case 'email':
        return `mailto:?subject=${title}&body=${description}%20${url}`;
      default:
        return '#';
    }
  };
  
  const handleShare = (platform) => {
    const shareUrl = getShareUrl(platform);
    if (platform !== 'email') {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    } else {
      window.location.href = shareUrl;
    }
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy link: ', err);
      });
  };
  
  return (
    <div className="social-share">
      <div className="share-title">Share this product:</div>
      
      <div className="share-buttons">
        <button 
          className="share-button facebook"
          onClick={() => handleShare('facebook')}
          aria-label="Share on Facebook"
        >
          <div className="icon">f</div>
          <span className="platform-name">Facebook</span>
        </button>
        
        <button 
          className="share-button twitter"
          onClick={() => handleShare('twitter')}
          aria-label="Share on Twitter"
        >
          <div className="icon">t</div>
          <span className="platform-name">Twitter</span>
        </button>
        
        <button 
          className="share-button pinterest"
          onClick={() => handleShare('pinterest')}
          aria-label="Share on Pinterest"
        >
          <div className="icon">p</div>
          <span className="platform-name">Pinterest</span>
        </button>
        
        <button 
          className="share-button whatsapp"
          onClick={() => handleShare('whatsapp')}
          aria-label="Share on WhatsApp"
        >
          <div className="icon">w</div>
          <span className="platform-name">WhatsApp</span>
        </button>
        
        <button 
          className="share-button email"
          onClick={() => handleShare('email')}
          aria-label="Share via Email"
        >
          <div className="icon">✉</div>
          <span className="platform-name">Email</span>
        </button>
        
        <button 
          className="share-button copy-link"
          onClick={handleCopyLink}
          aria-label="Copy Link"
        >
          <div className="icon">🔗</div>
          <span className="platform-name">Copy Link</span>
          {showTooltip && <span className="copy-tooltip">Link copied!</span>}
        </button>
      </div>
    </div>
  );
};

export default SocialShare;