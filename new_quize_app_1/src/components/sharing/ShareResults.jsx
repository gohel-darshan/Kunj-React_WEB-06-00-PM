import { useState } from 'react';
import styled from 'styled-components';
import { FaTwitter, FaFacebook, FaWhatsapp, FaLink, FaTimes } from 'react-icons/fa';
import Button from '../ui/Button';
import { toast } from 'react-toastify';
import { recordResultSharing } from '../../utils/achievements';
import { useLanguage } from '../../contexts/LanguageContext';

const ShareResults = ({ quizResult, onClose }) => {
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();
  
  if (!quizResult) return null;
  
  const shareText = `I scored ${quizResult.score}% on the ${quizResult.categoryName} quiz in QuizMaster! Can you beat my score?`;
  const shareUrl = window.location.origin;
  
  const handleShare = (platform) => {
    let shareUrl;
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(window.location.origin)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + window.location.origin)}`;
        break;
      default:
        return;
    }
    
    // Record sharing for achievements
    recordResultSharing();
    
    // Open share dialog
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareText + ' ' + shareUrl)
      .then(() => {
        setCopied(true);
        toast.success('Copied to clipboard!');
        
        // Record sharing for achievements
        recordResultSharing();
        
        setTimeout(() => setCopied(false), 3000);
      })
      .catch(() => {
        toast.error('Failed to copy to clipboard');
      });
  };
  
  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'QuizMaster Result',
        text: shareText,
        url: shareUrl,
      })
        .then(() => {
          // Record sharing for achievements
          recordResultSharing();
        })
        .catch((error) => {
          console.error('Error sharing:', error);
        });
    } else {
      copyToClipboard();
    }
  };
  
  return (
    <ShareContainer>
      <ShareHeader>
        <ShareTitle>Share Your Results</ShareTitle>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>
      </ShareHeader>
      
      <ShareContent>
        <ResultSummary>
          <ResultScore>{quizResult.score}%</ResultScore>
          <ResultDetails>
            <ResultCategory>{quizResult.categoryName}</ResultCategory>
            <ResultCorrect>{quizResult.correctAnswers} of {quizResult.totalQuestions} correct</ResultCorrect>
          </ResultDetails>
        </ResultSummary>
        
        <ShareMessage>{shareText}</ShareMessage>
        
        <ShareButtons>
          <ShareButton 
            color="#1DA1F2" 
            onClick={() => handleShare('twitter')}
            title="Share on Twitter"
          >
            <FaTwitter />
          </ShareButton>
          
          <ShareButton 
            color="#4267B2" 
            onClick={() => handleShare('facebook')}
            title="Share on Facebook"
          >
            <FaFacebook />
          </ShareButton>
          
          <ShareButton 
            color="#25D366" 
            onClick={() => handleShare('whatsapp')}
            title="Share on WhatsApp"
          >
            <FaWhatsapp />
          </ShareButton>
          
          <ShareButton 
            color="#718096" 
            onClick={copyToClipboard}
            title="Copy link"
          >
            <FaLink />
          </ShareButton>
        </ShareButtons>
        
        <Button 
          variant="primary" 
          fullWidth 
          onClick={handleNativeShare}
        >
          {navigator.share ? 'Share' : copied ? 'Copied!' : 'Copy to Clipboard'}
        </Button>
      </ShareContent>
    </ShareContainer>
  );
};

const ShareContainer = styled.div`
  background-color: ${props => props.theme.surface};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 500px;
  overflow: hidden;
`;

const ShareHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
`;

const ShareTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  color: ${props => props.theme.primary};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.text};
  cursor: pointer;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  
  &:hover {
    color: ${props => props.theme.primary};
  }
`;

const ShareContent = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ResultSummary = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem;
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
  border-radius: 8px;
`;

const ResultScore = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${props => props.theme.primary};
`;

const ResultDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ResultCategory = styled.div`
  font-weight: 500;
  font-size: 1.1rem;
`;

const ResultCorrect = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const ShareMessage = styled.div`
  padding: 1rem;
  border: 1px dashed ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 8px;
  font-size: 1rem;
  line-height: 1.5;
`;

const ShareButtons = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

const ShareButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  background-color: ${props => `${props.color}20`};
  color: ${props => props.color};
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => `${props.color}30`};
    transform: translateY(-2px);
  }
`;

export default ShareResults;