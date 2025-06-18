import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaFlask, FaMonument, FaCalculator, FaArrowRight } from 'react-icons/fa';
import Card, { CardHeader, CardTitle, CardSubtitle, CardBody, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useQuiz } from '../contexts/QuizContext';
import { toast } from 'react-toastify';

const CategoriesPage = () => {
  const { categories, startQuiz, username } = useQuiz();
  const navigate = useNavigate();

  useEffect(() => {
    if (!username) {
      toast.error('Please enter your name first');
      navigate('/');
    }
  }, [username, navigate]);

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'flask':
        return <FaFlask />;
      case 'monument':
        return <FaMonument />;
      case 'calculator':
        return <FaCalculator />;
      default:
        return <FaFlask />;
    }
  };

  const handleCategorySelect = async (categoryId) => {
    await startQuiz(categoryId);
    navigate('/quiz');
  };

  return (
    <CategoriesContainer>
      <PageHeader>
        <Title>Choose a Quiz Category</Title>
        <Subtitle>Select a category to start your quiz</Subtitle>
      </PageHeader>

      <CategoriesGrid>
        {categories.map((category) => (
          <CategoryCard 
            key={category.id}
            hoverable
            onClick={() => handleCategorySelect(category.id)}
          >
            <CardHeader>
              <CategoryIcon difficulty={category.difficulty}>
                {getCategoryIcon(category.icon)}
              </CategoryIcon>
              <CardTitle>{category.name}</CardTitle>
              <CardSubtitle>{category.description}</CardSubtitle>
            </CardHeader>
            <CardBody>
              <CategoryDetails>
                <CategoryDetail>
                  <DetailLabel>Difficulty:</DetailLabel>
                  <DifficultyBadge difficulty={category.difficulty}>
                    {category.difficulty}
                  </DifficultyBadge>
                </CategoryDetail>
                <CategoryDetail>
                  <DetailLabel>Questions:</DetailLabel>
                  <DetailValue>{category.questionsCount}</DetailValue>
                </CategoryDetail>
                <CategoryDetail>
                  <DetailLabel>Time:</DetailLabel>
                  <DetailValue>{category.timePerQuestion} sec/question</DetailValue>
                </CategoryDetail>
              </CategoryDetails>
            </CardBody>
            <CardFooter>
              <Button 
                variant="primary" 
                fullWidth
                icon={<FaArrowRight />}
                iconPosition="right"
              >
                Start Quiz
              </Button>
            </CardFooter>
          </CategoryCard>
        ))}
      </CategoriesGrid>
    </CategoriesContainer>
  );
};

const CategoriesContainer = styled.div`
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

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const CategoryCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const CategoryIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  background-color: ${props => {
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
  color: white;
`;

const CategoryDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const CategoryDetail = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  
  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.span`
  font-weight: 500;
`;

const DetailValue = styled.span`
  opacity: 0.8;
`;

const DifficultyBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
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

export default CategoriesPage;