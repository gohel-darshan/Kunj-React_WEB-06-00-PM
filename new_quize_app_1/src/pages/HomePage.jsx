import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FaPlay, FaUserAlt, FaArrowRight, FaHistory, FaBrain, FaClock, FaChartLine, FaTrophy, FaInfoCircle } from 'react-icons/fa';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle, CardBody, CardFooter, CardGrid } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { useQuiz } from '../contexts/QuizContext';
import { toast } from 'react-toastify';

const HomePage = () => {
  const { username, setUsername, loadProgress } = useQuiz();
  const [inputUsername, setInputUsername] = useState(username || '');
  const [hasSavedProgress, setHasSavedProgress] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there's saved progress
    const savedProgress = localStorage.getItem('quizProgress');
    setHasSavedProgress(!!savedProgress);
    
    // Add animation classes with delay
    const elements = document.querySelectorAll('.animate-on-load');
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('visible');
      }, 100 * index);
    });
  }, []);

  const handleStartQuiz = () => {
    if (!inputUsername.trim()) {
      toast.error('Please enter your name to continue');
      return;
    }

    setUsername(inputUsername);
    navigate('/categories');
  };

  const handleContinueQuiz = () => {
    if (!inputUsername.trim()) {
      toast.error('Please enter your name to continue');
      return;
    }

    setUsername(inputUsername);
    const success = loadProgress();
    
    if (success) {
      navigate('/quiz');
      toast.info('Loaded your previous quiz progress');
    } else {
      toast.error('Could not load saved progress');
      navigate('/categories');
    }
  };

  return (
    <HomeContainer>
      <HomeHeader className="animate-on-load">
        <Title>Welcome to QuizMaster</Title>
        <Subtitle>Test your knowledge with fun and challenging quizzes!</Subtitle>
      </HomeHeader>

      <ContentContainer>
        <WelcomeCard 
          hoverable 
          gradient 
          borderHighlight
          elevation="medium"
          className="animate-on-load"
        >
          <CardHeader>
            <CardTitle>Ready to Challenge Yourself?</CardTitle>
            <InfoButton onClick={() => setShowInfoModal(true)}>
              <FaInfoCircle />
            </InfoButton>
          </CardHeader>
          <CardBody>
            <p>
              QuizMaster offers a variety of quizzes across different categories.
              Test your knowledge, track your progress, and compete with others!
            </p>

            <NameInputContainer>
              <Input
                label="Enter your name to get started"
                icon={<FaUserAlt />}
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
                placeholder="Your Name"
                maxLength={20}
                fullWidth
                variant="outlined"
              />
            </NameInputContainer>
          </CardBody>
          <CardFooter>
            <Button
              variant="primary"
              size="large"
              icon={<FaPlay />}
              onClick={handleStartQuiz}
              fullWidth
              animated
              ripple
            >
              Start New Quiz
            </Button>
            
            {hasSavedProgress && (
              <Button
                variant="outline"
                size="large"
                icon={<FaHistory />}
                onClick={handleContinueQuiz}
                fullWidth
                animated
                style={{ marginTop: '1rem' }}
              >
                Continue Previous Quiz
              </Button>
            )}
          </CardFooter>
        </WelcomeCard>

        <FeaturesContainer>
          <FeatureCard 
            hoverable 
            glassmorphism
            className="animate-on-load"
          >
            <FeatureIconWrapper>
              <FaBrain />
            </FeatureIconWrapper>
            <FeatureTitle>Multiple Categories</FeatureTitle>
            <FeatureDescription>
              Choose from Science, History, Math, and more to test your knowledge in different areas.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard 
            hoverable 
            glassmorphism
            className="animate-on-load"
          >
            <FeatureIconWrapper>
              <FaClock />
            </FeatureIconWrapper>
            <FeatureTitle>Timed Quizzes</FeatureTitle>
            <FeatureDescription>
              Challenge yourself with time limits for each question to test your quick thinking.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard 
            hoverable 
            glassmorphism
            className="animate-on-load"
          >
            <FeatureIconWrapper>
              <FaChartLine />
            </FeatureIconWrapper>
            <FeatureTitle>Track Progress</FeatureTitle>
            <FeatureDescription>
              See your scores, review answers, and track your improvement over time.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard 
            hoverable 
            glassmorphism
            className="animate-on-load"
          >
            <FeatureIconWrapper>
              <FaTrophy />
            </FeatureIconWrapper>
            <FeatureTitle>Leaderboard</FeatureTitle>
            <FeatureDescription>
              Compete with others and see your ranking on the leaderboard.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesContainer>
      </ContentContainer>

      <GetStartedSection className="animate-on-load">
        <GetStartedText>Ready to test your knowledge?</GetStartedText>
        <Button
          variant="primary"
          size="large"
          icon={<FaArrowRight />}
          iconPosition="right"
          onClick={handleStartQuiz}
          animated
          ripple
        >
          Get Started Now
        </Button>
      </GetStartedSection>
      
      <Modal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title="About QuizMaster"
        size="medium"
        animation="zoom"
        glassmorphism
        footer={
          <Button variant="primary" onClick={() => setShowInfoModal(false)}>
            Got it!
          </Button>
        }
      >
        <div className="modal-content">
          <h3>How to Play</h3>
          <p>
            QuizMaster is an interactive quiz application that tests your knowledge across various categories.
            Simply enter your name, select a category, and start answering questions!
          </p>
          
          <h3>Features</h3>
          <ul>
            <li>Multiple quiz categories to choose from</li>
            <li>Timed questions to test your quick thinking</li>
            <li>Track your progress and see your improvement</li>
            <li>Compete with others on the leaderboard</li>
            <li>Create your own quizzes and share them</li>
          </ul>
          
          <h3>Scoring</h3>
          <p>
            Your score is calculated based on the number of correct answers and the time taken to answer each question.
            The faster you answer correctly, the higher your score!
          </p>
        </div>
        
        {/* Footer will be passed as a prop */}
      </Modal>
    </HomeContainer>
  );
};

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  
  .animate-on-load {
    opacity: 0;
    transform: translateY(20px);
    
    &.visible {
      animation: ${fadeIn} 0.5s ease-out forwards;
    }
  }
`;

const HomeHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.primary};
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.3rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 992px) {
    flex-direction: column;
  }
`;

const WelcomeCard = styled(Card)`
  flex: 1;
  min-width: 300px;
`;

const NameInputContainer = styled.div`
  margin-top: 1.5rem;
`;

const InfoButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.primary};
  font-size: 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
    transform: scale(1.1);
  }
`;

const FeaturesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  flex: 1;
`;

const FeatureCard = styled(Card)`
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: visible;
`;

const FeatureIconWrapper = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: ${props => `linear-gradient(135deg, ${props.theme.primary} 0%, ${props.theme.isDark ? '#3a7bc2' : '#6ba5e7'} 100%)`};
  color: white;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
  box-shadow: 0 8px 16px rgba(74, 144, 226, 0.3);
  position: relative;
  z-index: 1;
  
  &::after {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    border-radius: 50%;
    background: ${props => `linear-gradient(135deg, ${props.theme.primary}50 0%, ${props.theme.isDark ? '#3a7bc250' : '#6ba5e750'} 100%)`};
    z-index: -1;
    animation: ${pulse} 2s infinite;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 0.75rem;
  color: ${props => props.theme.primary};
  font-weight: 600;
`;

const FeatureDescription = styled.p`
  font-size: 0.95rem;
  opacity: 0.9;
  line-height: 1.6;
`;

const GetStartedSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin-top: 2rem;
  padding: 3rem 2rem;
  background: ${props => props.theme.isDark 
    ? `linear-gradient(135deg, rgba(74, 144, 226, 0.1) 0%, rgba(0, 0, 0, 0.2) 100%)`
    : `linear-gradient(135deg, rgba(74, 144, 226, 0.1) 0%, rgba(255, 255, 255, 0.5) 100%)`};
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const GetStartedText = styled.h2`
  font-size: 1.8rem;
  margin: 0;
  font-weight: 600;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

// Add modal content styling to the global styles in App.jsx instead

export default HomePage;