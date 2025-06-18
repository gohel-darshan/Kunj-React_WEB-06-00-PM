import { useState } from 'react';
import styled from 'styled-components';
import { FaArrowLeft, FaArrowRight, FaCheck, FaBookmark, FaEye } from 'react-icons/fa';
import Button from '../ui/Button';
import { useQuiz } from '../../contexts/QuizContext';

const QuizNavigation = ({ onSubmit }) => {
  const { 
    questions, 
    currentQuestionIndex, 
    handleNextQuestion, 
    handlePrevQuestion, 
    userAnswers,
    markedQuestions,
    quizCompleted,
  } = useQuiz();
  
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const hasAnsweredCurrent = userAnswers[currentQuestionIndex] !== null && 
                            userAnswers[currentQuestionIndex] !== undefined;
  
  const answeredCount = userAnswers.filter(answer => 
    answer !== null && answer !== undefined
  ).length;
  
  const handleSubmitClick = () => {
    if (answeredCount < questions.length) {
      setShowConfirmation(true);
    } else {
      onSubmit();
    }
  };
  
  const confirmSubmit = () => {
    setShowConfirmation(false);
    onSubmit();
  };
  
  const cancelSubmit = () => {
    setShowConfirmation(false);
  };
  
  return (
    <NavigationContainer>
      <NavigationButtons>
        <Button 
          variant="outline" 
          onClick={handlePrevQuestion} 
          disabled={isFirstQuestion}
          icon={<FaArrowLeft />}
          iconPosition="left"
        >
          Previous
        </Button>
        
        {!isLastQuestion ? (
          <Button 
            variant={hasAnsweredCurrent ? "primary" : "outline"} 
            onClick={handleNextQuestion}
            icon={<FaArrowRight />}
            iconPosition="right"
          >
            Next
          </Button>
        ) : (
          <Button 
            variant="success" 
            onClick={handleSubmitClick}
            icon={<FaCheck />}
            iconPosition="right"
          >
            Submit Quiz
          </Button>
        )}
      </NavigationButtons>
      
      <QuizProgress>
        <ProgressText>
          {answeredCount} of {questions.length} questions answered
        </ProgressText>
        <ProgressIndicator>
          {questions.map((_, index) => (
            <ProgressDot 
              key={index}
              active={index === currentQuestionIndex}
              answered={userAnswers[index] !== null && userAnswers[index] !== undefined}
              marked={markedQuestions.includes(index)}
              onClick={() => !quizCompleted && onNavigateToQuestion(index)}
            >
              {markedQuestions.includes(index) && <FaBookmark />}
            </ProgressDot>
          ))}
        </ProgressIndicator>
      </QuizProgress>
      
      {showConfirmation && (
        <ConfirmationOverlay>
          <ConfirmationDialog>
            <ConfirmationTitle>Submit Quiz?</ConfirmationTitle>
            <ConfirmationMessage>
              You have only answered {answeredCount} out of {questions.length} questions.
              Are you sure you want to submit the quiz?
            </ConfirmationMessage>
            <ConfirmationButtons>
              <Button variant="outline" onClick={cancelSubmit}>
                Continue Quiz
              </Button>
              <Button variant="primary" onClick={confirmSubmit}>
                Submit Anyway
              </Button>
            </ConfirmationButtons>
          </ConfirmationDialog>
        </ConfirmationOverlay>
      )}
    </NavigationContainer>
  );
};

const NavigationContainer = styled.div`
  margin-top: 2rem;
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 1rem;
    
    button {
      width: 100%;
    }
  }
`;

const QuizProgress = styled.div`
  margin-top: 1rem;
`;

const ProgressText = styled.div`
  text-align: center;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: ${props => props.theme.text};
  opacity: 0.8;
`;

const ProgressIndicator = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const ProgressDot = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${props => {
    if (props.active) return props.theme.primary;
    if (props.answered) return props.theme.success;
    return props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  }};
  color: ${props => {
    if (props.active || props.answered) return 'white';
    return props.theme.text;
  }};
  border: 2px solid ${props => {
    if (props.active) return props.theme.primary;
    if (props.answered) return props.theme.success;
    if (props.marked) return props.theme.warning;
    return 'transparent';
  }};
  
  &:hover {
    transform: scale(1.1);
  }
  
  svg {
    font-size: 0.6rem;
    color: ${props => props.theme.warning};
  }
`;

const ConfirmationOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ConfirmationDialog = styled.div`
  background-color: ${props => props.theme.surface};
  border-radius: 8px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const ConfirmationTitle = styled.h3`
  margin: 0 0 1rem;
  font-size: 1.5rem;
  color: ${props => props.theme.text};
`;

const ConfirmationMessage = styled.p`
  margin: 0 0 1.5rem;
  line-height: 1.5;
  color: ${props => props.theme.text};
`;

const ConfirmationButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    
    button {
      width: 100%;
    }
  }
`;

export default QuizNavigation;