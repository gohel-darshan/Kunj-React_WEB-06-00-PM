import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaPlus, FaTrash, FaSave, FaArrowLeft, FaCheck } from 'react-icons/fa';
import Card, { CardHeader, CardTitle, CardBody, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { toast } from 'react-toastify';
import { generateId } from '../utils/helpers';
import { saveCustomQuiz, getCustomQuizzes } from '../utils/storage';
import { useQuiz } from '../contexts/QuizContext';

const CreateQuizPage = () => {
  const navigate = useNavigate();
  const { username } = useQuiz();
  
  const [quizData, setQuizData] = useState({
    id: generateId(),
    name: '',
    description: '',
    category: 'custom',
    difficulty: 'medium',
    createdBy: username || 'Anonymous',
    questions: [createEmptyQuestion()],
  });
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editingQuizId, setEditingQuizId] = useState(null);
  
  useEffect(() => {
    // Check if we're editing an existing quiz
    const searchParams = new URLSearchParams(window.location.search);
    const quizId = searchParams.get('edit');
    
    if (quizId) {
      const customQuizzes = getCustomQuizzes();
      const quizToEdit = customQuizzes.find(quiz => quiz.id === quizId);
      
      if (quizToEdit) {
        setQuizData(quizToEdit);
        setIsEditing(true);
        setEditingQuizId(quizId);
      }
    }
  }, []);
  
  useEffect(() => {
    // Update creator name if username changes
    if (username) {
      setQuizData(prev => ({
        ...prev,
        createdBy: username
      }));
    }
  }, [username]);
  
  function createEmptyQuestion() {
    return {
      id: generateId(),
      type: 'multiple',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: '',
    };
  }
  
  const handleQuizInfoChange = (e) => {
    const { name, value } = e.target;
    setQuizData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };
    
    setQuizData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };
  
  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...quizData.questions];
    const updatedOptions = [...updatedQuestions[questionIndex].options];
    updatedOptions[optionIndex] = value;
    
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options: updatedOptions
    };
    
    setQuizData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };
  
  const handleCorrectAnswerChange = (questionIndex, value) => {
    const updatedQuestions = [...quizData.questions];
    
    if (updatedQuestions[questionIndex].type === 'checkbox') {
      // For checkbox questions, toggle the value in the array
      let currentAnswers = Array.isArray(updatedQuestions[questionIndex].correctAnswer) 
        ? [...updatedQuestions[questionIndex].correctAnswer] 
        : [];
      
      if (currentAnswers.includes(value)) {
        currentAnswers = currentAnswers.filter(answer => answer !== value);
      } else {
        currentAnswers.push(value);
      }
      
      updatedQuestions[questionIndex].correctAnswer = currentAnswers;
    } else {
      // For other question types, just set the value
      updatedQuestions[questionIndex].correctAnswer = value;
    }
    
    setQuizData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };
  
  const handleQuestionTypeChange = (questionIndex, type) => {
    const updatedQuestions = [...quizData.questions];
    
    // Reset correct answer based on new type
    let correctAnswer = '';
    if (type === 'checkbox') {
      correctAnswer = [];
    } else if (type === 'boolean') {
      correctAnswer = 'True';
      updatedQuestions[questionIndex].options = ['True', 'False'];
    }
    
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      type,
      correctAnswer
    };
    
    setQuizData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };
  
  const addQuestion = () => {
    setQuizData(prev => ({
      ...prev,
      questions: [...prev.questions, createEmptyQuestion()]
    }));
  };
  
  const removeQuestion = (index) => {
    if (quizData.questions.length <= 1) {
      toast.error('Quiz must have at least one question');
      return;
    }
    
    const updatedQuestions = quizData.questions.filter((_, i) => i !== index);
    setQuizData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };
  
  const addOption = (questionIndex) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[questionIndex].options.push('');
    
    setQuizData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };
  
  const removeOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...quizData.questions];
    
    if (updatedQuestions[questionIndex].options.length <= 2) {
      toast.error('Question must have at least two options');
      return;
    }
    
    // Remove the option
    updatedQuestions[questionIndex].options = updatedQuestions[questionIndex].options.filter((_, i) => i !== optionIndex);
    
    // If the removed option was the correct answer, reset the correct answer
    if (updatedQuestions[questionIndex].type === 'checkbox') {
      if (Array.isArray(updatedQuestions[questionIndex].correctAnswer)) {
        const removedOption = quizData.questions[questionIndex].options[optionIndex];
        updatedQuestions[questionIndex].correctAnswer = updatedQuestions[questionIndex].correctAnswer.filter(
          answer => answer !== removedOption
        );
      }
    } else if (updatedQuestions[questionIndex].correctAnswer === quizData.questions[questionIndex].options[optionIndex]) {
      updatedQuestions[questionIndex].correctAnswer = '';
    }
    
    setQuizData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };
  
  const validateQuizInfo = () => {
    if (!quizData.name.trim()) {
      toast.error('Please enter a quiz name');
      return false;
    }
    
    if (!quizData.description.trim()) {
      toast.error('Please enter a quiz description');
      return false;
    }
    
    return true;
  };
  
  const validateQuestions = () => {
    for (let i = 0; i < quizData.questions.length; i++) {
      const question = quizData.questions[i];
      
      if (!question.question.trim()) {
        toast.error(`Question ${i + 1} is empty`);
        return false;
      }
      
      // Check if all options have values
      if (question.type !== 'short_answer') {
        for (let j = 0; j < question.options.length; j++) {
          if (!question.options[j].trim()) {
            toast.error(`Option ${j + 1} in question ${i + 1} is empty`);
            return false;
          }
        }
      }
      
      // Check if correct answer is set
      if (question.type === 'checkbox') {
        if (!Array.isArray(question.correctAnswer) || question.correctAnswer.length === 0) {
          toast.error(`Please select at least one correct answer for question ${i + 1}`);
          return false;
        }
      } else if (!question.correctAnswer) {
        toast.error(`Please set the correct answer for question ${i + 1}`);
        return false;
      }
    }
    
    return true;
  };
  
  const handleNext = () => {
    if (currentStep === 0 && !validateQuizInfo()) {
      return;
    }
    
    setCurrentStep(currentStep + 1);
  };
  
  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };
  
  const handleSaveQuiz = () => {
    if (!validateQuestions()) {
      return;
    }
    
    try {
      saveCustomQuiz(quizData);
      toast.success(isEditing ? 'Quiz updated successfully!' : 'Quiz created successfully!');
      navigate('/my-quizzes');
    } catch (error) {
      console.error('Error saving quiz:', error);
      toast.error('Failed to save quiz. Please try again.');
    }
  };
  
  const renderQuizInfoForm = () => (
    <FormSection>
      <FormGroup>
        <Label htmlFor="name">Quiz Name</Label>
        <Input
          id="name"
          name="name"
          value={quizData.name}
          onChange={handleQuizInfoChange}
          placeholder="Enter quiz name"
          maxLength={50}
        />
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={quizData.description}
          onChange={handleQuizInfoChange}
          placeholder="Enter quiz description"
          rows={3}
          maxLength={200}
        />
      </FormGroup>
      
      <FormRow>
        <FormGroup>
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select
            id="difficulty"
            name="difficulty"
            value={quizData.difficulty}
            onChange={handleQuizInfoChange}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="createdBy">Created By</Label>
          <Input
            id="createdBy"
            name="createdBy"
            value={quizData.createdBy}
            onChange={handleQuizInfoChange}
            placeholder="Your name"
            maxLength={30}
          />
        </FormGroup>
      </FormRow>
    </FormSection>
  );
  
  const renderQuestionForm = (question, index) => (
    <QuestionCard key={question.id}>
      <CardHeader>
        <QuestionHeader>
          <CardTitle>Question {index + 1}</CardTitle>
          <Button
            variant="danger"
            size="small"
            icon={<FaTrash />}
            onClick={() => removeQuestion(index)}
          >
            Remove
          </Button>
        </QuestionHeader>
      </CardHeader>
      
      <CardBody>
        <FormGroup>
          <Label htmlFor={`question-${index}`}>Question</Label>
          <Input
            id={`question-${index}`}
            value={question.question}
            onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
            placeholder="Enter your question"
            maxLength={200}
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Question Type</Label>
          <TypeSelector>
            <TypeOption
              selected={question.type === 'multiple'}
              onClick={() => handleQuestionTypeChange(index, 'multiple')}
            >
              Multiple Choice
            </TypeOption>
            <TypeOption
              selected={question.type === 'checkbox'}
              onClick={() => handleQuestionTypeChange(index, 'checkbox')}
            >
              Checkbox (Multiple Answers)
            </TypeOption>
            <TypeOption
              selected={question.type === 'boolean'}
              onClick={() => handleQuestionTypeChange(index, 'boolean')}
            >
              True/False
            </TypeOption>
            <TypeOption
              selected={question.type === 'short_answer'}
              onClick={() => handleQuestionTypeChange(index, 'short_answer')}
            >
              Short Answer
            </TypeOption>
          </TypeSelector>
        </FormGroup>
        
        {question.type !== 'short_answer' && (
          <OptionsContainer>
            <OptionsHeader>
              <Label>Options</Label>
              {question.type !== 'boolean' && (
                <Button
                  variant="outline"
                  size="small"
                  icon={<FaPlus />}
                  onClick={() => addOption(index)}
                >
                  Add Option
                </Button>
              )}
            </OptionsHeader>
            
            {question.options.map((option, optionIndex) => (
              <OptionRow key={optionIndex}>
                <OptionInput
                  value={option}
                  onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                  placeholder={`Option ${optionIndex + 1}`}
                  maxLength={100}
                />
                
                {question.type === 'checkbox' ? (
                  <OptionCheckbox
                    type="checkbox"
                    checked={Array.isArray(question.correctAnswer) && question.correctAnswer.includes(option)}
                    onChange={() => handleCorrectAnswerChange(index, option)}
                    disabled={!option.trim()}
                  />
                ) : (
                  <OptionRadio
                    type="radio"
                    name={`correct-${question.id}`}
                    checked={question.correctAnswer === option}
                    onChange={() => handleCorrectAnswerChange(index, option)}
                    disabled={!option.trim()}
                  />
                )}
                
                {question.type !== 'boolean' && (
                  <RemoveOptionButton
                    onClick={() => removeOption(index, optionIndex)}
                    title="Remove option"
                  >
                    <FaTrash />
                  </RemoveOptionButton>
                )}
              </OptionRow>
            ))}
          </OptionsContainer>
        )}
        
        {question.type === 'short_answer' && (
          <FormGroup>
            <Label htmlFor={`correct-answer-${index}`}>Correct Answer</Label>
            <Input
              id={`correct-answer-${index}`}
              value={question.correctAnswer}
              onChange={(e) => handleCorrectAnswerChange(index, e.target.value)}
              placeholder="Enter the correct answer"
              maxLength={100}
            />
          </FormGroup>
        )}
        
        <FormGroup>
          <Label htmlFor={`explanation-${index}`}>Explanation (Optional)</Label>
          <Textarea
            id={`explanation-${index}`}
            value={question.explanation}
            onChange={(e) => handleQuestionChange(index, 'explanation', e.target.value)}
            placeholder="Explain why the answer is correct"
            rows={2}
            maxLength={200}
          />
        </FormGroup>
      </CardBody>
    </QuestionCard>
  );
  
  return (
    <PageContainer>
      <PageHeader>
        <Title>{isEditing ? 'Edit Quiz' : 'Create New Quiz'}</Title>
        <Subtitle>
          {currentStep === 0 
            ? 'Start by entering basic information about your quiz' 
            : 'Now add your questions and answers'}
        </Subtitle>
      </PageHeader>
      
      <StepIndicator>
        <Step active={currentStep === 0} completed={currentStep > 0}>
          <StepNumber>1</StepNumber>
          <StepLabel>Quiz Info</StepLabel>
        </Step>
        <StepConnector completed={currentStep > 0} />
        <Step active={currentStep === 1} completed={false}>
          <StepNumber>2</StepNumber>
          <StepLabel>Questions</StepLabel>
        </Step>
      </StepIndicator>
      
      {currentStep === 0 ? (
        <Card>
          <CardBody>
            {renderQuizInfoForm()}
          </CardBody>
          <CardFooter>
            <Button
              variant="outline"
              onClick={() => navigate('/my-quizzes')}
              icon={<FaArrowLeft />}
              iconPosition="left"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleNext}
              icon={<FaArrowRight />}
              iconPosition="right"
            >
              Next: Add Questions
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <>
          <QuestionsContainer>
            {quizData.questions.map((question, index) => renderQuestionForm(question, index))}
            
            <AddQuestionButton onClick={addQuestion}>
              <FaPlus />
              <span>Add Question</span>
            </AddQuestionButton>
          </QuestionsContainer>
          
          <ActionButtons>
            <Button
              variant="outline"
              onClick={handlePrevious}
              icon={<FaArrowLeft />}
              iconPosition="left"
            >
              Back to Quiz Info
            </Button>
            <Button
              variant="success"
              onClick={handleSaveQuiz}
              icon={<FaSave />}
              iconPosition="left"
            >
              {isEditing ? 'Update Quiz' : 'Save Quiz'}
            </Button>
          </ActionButtons>
        </>
      )}
    </PageContainer>
  );
};

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.primary};
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0.8;
`;

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const StepNumber = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  background-color: ${props => {
    if (props.active) return props.theme.primary;
    if (props.completed) return props.theme.success;
    return props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  }};
  color: ${props => {
    if (props.active || props.completed) return 'white';
    return props.theme.text;
  }};
`;

const StepLabel = styled.div`
  margin-top: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
`;

const StepConnector = styled.div`
  width: 4rem;
  height: 2px;
  background-color: ${props => {
    if (props.completed) return props.theme.success;
    return props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  }};
  margin: 0 1rem;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  font-weight: 500;
  color: ${props => props.theme.text};
`;

const Input = styled.input`
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
  color: ${props => props.theme.text};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
  color: ${props => props.theme.text};
  font-size: 1rem;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
  color: ${props => props.theme.text};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const QuestionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const QuestionCard = styled(Card)`
  border-left: 4px solid ${props => props.theme.primary};
`;

const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TypeSelector = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const TypeOption = styled.div`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid ${props => props.selected ? props.theme.primary : props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  background-color: ${props => props.selected ? `${props.theme.primary}20` : 'transparent'};
  color: ${props => props.selected ? props.theme.primary : props.theme.text};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.primary};
    background-color: ${props => props.selected ? `${props.theme.primary}20` : `${props.theme.primary}10`};
  }
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const OptionsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const OptionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const OptionInput = styled(Input)`
  flex: 1;
`;

const OptionRadio = styled.input`
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
`;

const OptionCheckbox = styled.input`
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
`;

const RemoveOptionButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.error};
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  
  &:hover {
    opacity: 0.8;
  }
`;

const AddQuestionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px dashed ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 8px;
  background-color: transparent;
  color: ${props => props.theme.primary};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
    border-color: ${props => props.theme.primary};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    
    button {
      width: 100%;
    }
  }
`;

export default CreateQuizPage;