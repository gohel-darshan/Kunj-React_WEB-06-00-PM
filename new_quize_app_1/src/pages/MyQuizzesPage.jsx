import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaPlus, FaEdit, FaTrash, FaPlay, FaShare, FaEllipsisV } from 'react-icons/fa';
import Card, { CardHeader, CardTitle, CardBody, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { toast } from 'react-toastify';
import { getCustomQuizzes, removeCustomQuiz } from '../utils/storage';
import { useQuiz } from '../contexts/QuizContext';

const MyQuizzesPage = () => {
  const [customQuizzes, setCustomQuizzes] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);
  const navigate = useNavigate();
  const { startCustomQuiz } = useQuiz();

  useEffect(() => {
    loadCustomQuizzes();
  }, []);

  const loadCustomQuizzes = () => {
    const quizzes = getCustomQuizzes();
    setCustomQuizzes(quizzes);
  };

  const handleCreateQuiz = () => {
    navigate('/create-quiz');
  };

  const handleEditQuiz = (quizId) => {
    navigate(`/create-quiz?edit=${quizId}`);
    setActiveMenu(null);
  };

  const handleDeleteQuiz = (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      removeCustomQuiz(quizId);
      toast.success('Quiz deleted successfully');
      loadCustomQuizzes();
    }
    setActiveMenu(null);
  };

  const handleStartQuiz = (quiz) => {
    startCustomQuiz(quiz);
    navigate('/quiz');
    setActiveMenu(null);
  };

  const handleShareQuiz = (quiz) => {
    // Create a shareable link or code
    const shareText = `Check out my quiz "${quiz.name}" on QuizMaster!`;
    
    if (navigator.share) {
      navigator.share({
        title: quiz.name,
        text: shareText,
        url: window.location.origin,
      }).catch(err => {
        console.error('Error sharing:', err);
        toast.error('Could not share quiz');
      });
    } else {
      navigator.clipboard.writeText(shareText)
        .then(() => toast.success('Quiz info copied to clipboard!'))
        .catch(() => toast.error('Could not copy to clipboard'));
    }
    
    setActiveMenu(null);
  };

  const toggleMenu = (quizId) => {
    setActiveMenu(activeMenu === quizId ? null : quizId);
  };

  return (
    <PageContainer>
      <PageHeader>
        <Title>My Quizzes</Title>
        <Subtitle>Create, edit, and play your custom quizzes</Subtitle>
      </PageHeader>

      <CreateQuizButton onClick={handleCreateQuiz}>
        <FaPlus />
        <span>Create New Quiz</span>
      </CreateQuizButton>

      {customQuizzes.length === 0 ? (
        <EmptyState>
          <EmptyMessage>You haven't created any quizzes yet</EmptyMessage>
          <EmptyDescription>
            Create your first quiz by clicking the button above!
          </EmptyDescription>
        </EmptyState>
      ) : (
        <QuizzesGrid>
          {customQuizzes.map(quiz => (
            <QuizCard key={quiz.id}>
              <CardHeader>
                <QuizCardHeader>
                  <CardTitle>{quiz.name}</CardTitle>
                  <MenuButton onClick={() => toggleMenu(quiz.id)}>
                    <FaEllipsisV />
                  </MenuButton>
                  {activeMenu === quiz.id && (
                    <MenuDropdown>
                      <MenuItem onClick={() => handleEditQuiz(quiz.id)}>
                        <FaEdit />
                        <span>Edit</span>
                      </MenuItem>
                      <MenuItem onClick={() => handleShareQuiz(quiz)}>
                        <FaShare />
                        <span>Share</span>
                      </MenuItem>
                      <MenuItem onClick={() => handleDeleteQuiz(quiz.id)} danger>
                        <FaTrash />
                        <span>Delete</span>
                      </MenuItem>
                    </MenuDropdown>
                  )}
                </QuizCardHeader>
                <QuizMeta>
                  <QuizMetaItem>
                    <span>Difficulty:</span>
                    <DifficultyBadge difficulty={quiz.difficulty}>
                      {quiz.difficulty}
                    </DifficultyBadge>
                  </QuizMetaItem>
                  <QuizMetaItem>
                    <span>Questions:</span>
                    <span>{quiz.questions.length}</span>
                  </QuizMetaItem>
                </QuizMeta>
              </CardHeader>
              <CardBody>
                <QuizDescription>{quiz.description}</QuizDescription>
                <CreatedBy>Created by: {quiz.createdBy}</CreatedBy>
              </CardBody>
              <CardFooter>
                <Button
                  variant="primary"
                  fullWidth
                  icon={<FaPlay />}
                  onClick={() => handleStartQuiz(quiz)}
                >
                  Start Quiz
                </Button>
              </CardFooter>
            </QuizCard>
          ))}
        </QuizzesGrid>
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

const CreateQuizButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  max-width: 300px;
  margin: 0 auto;
  
  &:hover {
    background-color: ${props => {
      const color = props.theme.primary;
      return color.startsWith('#') 
        ? `#${color.substring(1).split('').map(c => {
            const hex = Math.max(0, parseInt(c, 16) - 1).toString(16);
            return hex;
          }).join('')}`
        : color;
    }};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  background-color: ${props => props.theme.surface};
  border-radius: 8px;
  margin-top: 2rem;
`;

const EmptyMessage = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.primary};
`;

const EmptyDescription = styled.p`
  opacity: 0.7;
`;

const QuizzesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const QuizCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const QuizCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.text};
  cursor: pointer;
  font-size: 1rem;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: ${props => props.theme.primary};
  }
`;

const MenuDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: ${props => props.theme.surface};
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
  min-width: 150px;
  overflow: hidden;
`;

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  text-align: left;
  color: ${props => props.danger ? props.theme.error : props.theme.text};
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
  }
`;

const QuizMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.75rem;
`;

const QuizMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  
  span:first-child {
    opacity: 0.7;
  }
`;

const DifficultyBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: ${props => {
    switch (props.difficulty.toLowerCase()) {
      case 'easy':
        return `${props.theme.success}20`;
      case 'medium':
        return `${props.theme.warning}20`;
      case 'hard':
        return `${props.theme.error}20`;
      default:
        return `${props.theme.primary}20`;
    }
  }};
  color: ${props => {
    switch (props.difficulty.toLowerCase()) {
      case 'easy':
        return props.theme.success;
      case 'medium':
        return props.theme.warning;
      case 'hard':
        return props.theme.error;
      default:
        return props.theme.primary;
    }
  }};
`;

const QuizDescription = styled.p`
  margin-bottom: 1rem;
  font-size: 0.95rem;
  line-height: 1.5;
`;

const CreatedBy = styled.div`
  font-size: 0.875rem;
  opacity: 0.7;
  margin-top: auto;
`;

export default MyQuizzesPage;