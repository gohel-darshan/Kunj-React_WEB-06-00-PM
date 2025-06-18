import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaBookmark, FaRegBookmark, FaCheck, FaTimes } from 'react-icons/fa';
import Card, { CardHeader, CardTitle, CardBody, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import { useQuiz } from '../../contexts/QuizContext';

const QuestionCard = ({ 
  question, 
  questionIndex, 
  showAnswer = false,
  reviewMode = false,
}) => {
  const { 
    userAnswers, 
    answerQuestion, 
    markedQuestions, 
    toggleMarkQuestion,
    quizCompleted,
  } = useQuiz();
  
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isMarked, setIsMarked] = useState(false);
  
  // Initialize state based on props and context
  useEffect(() => {
    setSelectedAnswer(userAnswers[questionIndex] || null);
    setIsMarked(markedQuestions.includes(questionIndex));
  }, [userAnswers, questionIndex, markedQuestions]);
  
  const handleAnswerSelect = (answer) => {
    if (quizCompleted || reviewMode) return;
    
    let newAnswer = answer;
    
    // For checkbox questions, handle multiple selections
    if (question.type === 'checkbox') {
      const currentAnswers = Array.isArray(selectedAnswer) ? [...selectedAnswer] : [];
      
      if (currentAnswers.includes(answer)) {
        newAnswer = currentAnswers.filter(a => a !== answer);
      } else {
        newAnswer = [...currentAnswers, answer];
      }
    }
    
    setSelectedAnswer(newAnswer);
    answerQuestion(newAnswer);
  };
  
  const handleShortAnswerChange = (e) => {
    if (quizCompleted || reviewMode) return;
    
    const answer = e.target.value;
    setSelectedAnswer(answer);
    answerQuestion(answer);
  };
  
  const handleMarkQuestion = () => {
    toggleMarkQuestion(questionIndex);
    setIsMarked(!isMarked);
  };
  
  const isCorrect = () => {
    if (!showAnswer || !selectedAnswer) return null;
    
    if (question.type === 'checkbox') {
      if (!Array.isArray(selectedAnswer) || !Array.isArray(question.correctAnswer)) {
        return false;
      }
      
      return (
        selectedAnswer.length === question.correctAnswer.length &&
        selectedAnswer.every(ans => question.correctAnswer.includes(ans))
      );
    }
    
    return selectedAnswer === question.correctAnswer;
  };
  
  const renderOptions = () => {
    switch (question.type) {
      case 'multiple':
      case 'boolean':
        return (
          <OptionsContainer>
            {question.options.map((option, index) => (
              <OptionItem 
                key={index}
                selected={selectedAnswer === option}
                correct={showAnswer && option === question.correctAnswer}
                incorrect={showAnswer && selectedAnswer === option && option !== question.correctAnswer}
                onClick={() => handleAnswerSelect(option)}
                disabled={quizCompleted || reviewMode}
              >
                <OptionLabel>{String.fromCharCode(65 + index)}</OptionLabel>
                <OptionText>{option}</OptionText>
                {showAnswer && option === question.correctAnswer && (
                  <CorrectIcon>
                    <FaCheck />
                  </CorrectIcon>
                )}
                {showAnswer && selectedAnswer === option && option !== question.correctAnswer && (
                  <IncorrectIcon>
                    <FaTimes />
                  </IncorrectIcon>
                )}
              </OptionItem>
            ))}
          </OptionsContainer>
        );
        
      case 'checkbox':
        return (
          <OptionsContainer>
            {question.options.map((option, index) => (
              <CheckboxItem 
                key={index}
                selected={selectedAnswer && Array.isArray(selectedAnswer) && selectedAnswer.includes(option)}
                correct={showAnswer && question.correctAnswer.includes(option)}
                incorrect={
                  showAnswer && 
                  selectedAnswer && 
                  Array.isArray(selectedAnswer) && 
                  selectedAnswer.includes(option) && 
                  !question.correctAnswer.includes(option)
                }
                onClick={() => handleAnswerSelect(option)}
                disabled={quizCompleted || reviewMode}
              >
                <CheckboxInput 
                  type="checkbox" 
                  checked={selectedAnswer && Array.isArray(selectedAnswer) && selectedAnswer.includes(option)}
                  onChange={() => {}}
                  disabled={quizCompleted || reviewMode}
                />
                <OptionText>{option}</OptionText>
                {showAnswer && question.correctAnswer.includes(option) && (
                  <CorrectIcon>
                    <FaCheck />
                  </CorrectIcon>
                )}
                {showAnswer && 
                  selectedAnswer && 
                  Array.isArray(selectedAnswer) && 
                  selectedAnswer.includes(option) && 
                  !question.correctAnswer.includes(option) && (
                  <IncorrectIcon>
                    <FaTimes />
                  </IncorrectIcon>
                )}
              </CheckboxItem>
            ))}
          </OptionsContainer>
        );
        
      case 'short_answer':
        return (
          <ShortAnswerContainer>
            <ShortAnswerInput 
              type="text" 
              value={selectedAnswer || ''}
              onChange={handleShortAnswerChange}
              placeholder="Type your answer here..."
              disabled={quizCompleted || reviewMode}
            />
            {showAnswer && (
              <AnswerFeedback correct={isCorrect()}>
                <strong>Correct answer:</strong> {question.correctAnswer}
              </AnswerFeedback>
            )}
          </ShortAnswerContainer>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <StyledCard>
      <CardHeader>
        <QuestionHeader>
          <QuestionNumber>Question {questionIndex + 1}</QuestionNumber>
          <BookmarkButton onClick={handleMarkQuestion} title={isMarked ? 'Unmark question' : 'Mark question for review'}>
            {isMarked ? <FaBookmark /> : <FaRegBookmark />}
          </BookmarkButton>
        </QuestionHeader>
        <CardTitle>{question.question}</CardTitle>
        {question.type === 'checkbox' && (
          <QuestionType>Select all that apply</QuestionType>
        )}
      </CardHeader>
      
      <CardBody>
        {renderOptions()}
        
        {showAnswer && question.explanation && (
          <Explanation>
            <ExplanationTitle>Explanation:</ExplanationTitle>
            <ExplanationText>{question.explanation}</ExplanationText>
          </Explanation>
        )}
      </CardBody>
      
      {showAnswer && (
        <ResultBadge correct={isCorrect()}>
          {isCorrect() ? 'Correct' : 'Incorrect'}
        </ResultBadge>
      )}
    </StyledCard>
  );
};

const StyledCard = styled(Card)`
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
`;

const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const QuestionNumber = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.primary};
`;

const QuestionType = styled.div`
  font-size: 0.875rem;
  font-style: italic;
  margin-top: 0.5rem;
  opacity: 0.7;
`;

const BookmarkButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.text};
  cursor: pointer;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.primary};
  }
  
  svg {
    color: ${props => props.theme.warning};
  }
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const OptionItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
  transition: all 0.2s ease;
  position: relative;
  border: 2px solid ${props => {
    if (props.correct) return props.theme.success;
    if (props.incorrect) return props.theme.error;
    if (props.selected) return props.theme.primary;
    return props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  }};
  background-color: ${props => {
    if (props.correct) return `${props.theme.success}20`;
    if (props.incorrect) return `${props.theme.error}20`;
    if (props.selected) return `${props.theme.primary}20`;
    return 'transparent';
  }};
  
  &:hover {
    background-color: ${props => {
      if (props.disabled) {
        if (props.correct) return `${props.theme.success}20`;
        if (props.incorrect) return `${props.theme.error}20`;
        if (props.selected) return `${props.theme.primary}20`;
        return 'transparent';
      }
      return props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
    }};
  }
`;

const OptionLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  margin-right: 1rem;
  font-weight: 600;
`;

const OptionText = styled.div`
  flex: 1;
`;

const CorrectIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 1rem;
  color: ${props => props.theme.success};
`;

const IncorrectIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 1rem;
  color: ${props => props.theme.error};
`;

const CheckboxItem = styled(OptionItem)`
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
`;

const CheckboxInput = styled.input`
  margin-right: 1rem;
  width: 1.25rem;
  height: 1.25rem;
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
`;

const ShortAnswerContainer = styled.div`
  margin-top: 1rem;
`;

const ShortAnswerInput = styled.input`
  width: 100%;
  padding: 1rem;
  border-radius: 8px;
  border: 2px solid ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
  color: ${props => props.theme.text};
  font-size: 1rem;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const AnswerFeedback = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background-color: ${props => props.correct ? `${props.theme.success}20` : `${props.theme.error}20`};
  border: 1px solid ${props => props.correct ? props.theme.success : props.theme.error};
`;

const Explanation = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 8px;
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'};
  border: 1px solid ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
`;

const ExplanationTitle = styled.h4`
  margin: 0 0 0.5rem;
  font-size: 1rem;
  font-weight: 600;
`;

const ExplanationText = styled.p`
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
`;

const ResultBadge = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.5rem 1rem;
  background-color: ${props => props.correct ? props.theme.success : props.theme.error};
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  border-bottom-left-radius: 8px;
`;

export default QuestionCard;