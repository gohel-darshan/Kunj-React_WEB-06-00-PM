import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaFlag, FaRegClock, FaBookmark } from 'react-icons/fa';
import QuestionCard from '../components/quiz/QuestionCard';
import QuizNavigation from '../components/quiz/QuizNavigation';
import Timer from '../components/ui/Timer';
import ProgressBar from '../components/ui/ProgressBar';
import Button from '../components/ui/Button';
import { useQuiz } from '../contexts/QuizContext';
import { toast } from 'react-toastify';

const QuizPage = () => {
  const { 
    questions, 
    currentQuestionIndex, 
    userAnswers, 
    quizStarted, 
    quizCompleted,
    selectedCategory,
    completeQuiz,
    markedQuestions,
    timeRemaining,
    isTimerActive,
    setIsTimerActive,
    quizSettings,
    username
  } = useQuiz();
  
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!username) {
      toast.error('Please enter your name first');
      navigate('/');
      return;
    }
    
    if (!quizStarted && !quizCompleted) {
      navigate('/categories');
    }
  }, [quizStarted, quizCompleted, navigate, username]);

  useEffect(() => {
    // Pause timer when showing results
    if (showResults) {
      setIsTimerActive(false);
    }
  }, [showResults, setIsTimerActive]);

  const handleSubmitQuiz = () => {
    completeQuiz();
    setShowResults(true);
  };

  const handleTimeUp = () => {
    toast.info('Time\'s up! Moving to the next question.');
    // Logic to handle time up is in the QuizContext
  };

  const handleViewResults = () => {
    navigate('/results');
  };

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = userAnswers.filter(answer => answer !== null && answer !== undefined).length;
  const progress = (currentQuestionIndex + 1) / questions.length * 100;

  if (!quizStarted || !currentQuestion) {
    return <LoadingContainer>Loading quiz...</LoadingContainer>;
  }

  return (
    <QuizContainer>
      <QuizHeader>
        <CategoryInfo>
          <CategoryName>{selectedCategory?.name} Quiz</CategoryName>
          <QuizStats>
            <QuizStat>
              <FaFlag />
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            </QuizStat>
            <QuizStat>
              <FaRegClock />
              <Timer 
                initialTime={timeRemaining} 
                onTimeUp={handleTimeUp}
                isActive={isTimerActive}
                warningThreshold={10}
                dangerThreshold={5}
              />
            </QuizStat>
            <QuizStat>
              <FaBookmark />
              <span>{markedQuestions.length} marked</span>
            </QuizStat>
          </QuizStats>
        </CategoryInfo>
        
        <ProgressBarContainer>
          <ProgressBar 
            value={progress} 
            max={100} 
            height="8px"
            animated
            striped
          />
          <ProgressStats>
            <ProgressStat>
              {answeredCount} of {questions.length} answered
            </ProgressStat>
            <ProgressStat>
              {Math.round(progress)}% complete
            </ProgressStat>
          </ProgressStats>
        </ProgressBarContainer>
      </QuizHeader>

      <QuestionCard 
        question={currentQuestion} 
        questionIndex={currentQuestionIndex}
        showAnswer={showResults}
      />

      {!showResults ? (
        <QuizNavigation onSubmit={handleSubmitQuiz} />
      ) : (
        <ResultsButtonContainer>
          <Button 
            variant="primary" 
            size="large" 
            onClick={handleViewResults}
            fullWidth
          >
            View Detailed Results
          </Button>
        </ResultsButtonContainer>
      )}
    </QuizContainer>
  );
};

const QuizContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const QuizHeader = styled.div`
  margin-bottom: 1rem;
`;

const CategoryInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const CategoryName = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  color: ${props => props.theme.primary};
`;

const QuizStats = styled.div`
  display: flex;
  gap: 1.5rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const QuizStat = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  
  svg {
    color: ${props => props.theme.primary};
  }
`;

const ProgressBarContainer = styled.div`
  margin-bottom: 1rem;
`;

const ProgressStats = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  opacity: 0.7;
`;

const ProgressStat = styled.div``;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  font-size: 1.2rem;
  color: ${props => props.theme.primary};
`;

const ResultsButtonContainer = styled.div`
  margin-top: 2rem;
`;

export default QuizPage;