import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaTrophy, FaCheck, FaTimes, FaRedo, FaHome, FaShare, FaFilePdf, FaChartPie } from 'react-icons/fa';
import Card, { CardHeader, CardTitle, CardBody, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import QuestionCard from '../components/quiz/QuestionCard';
import { useQuiz } from '../contexts/QuizContext';
import { toast } from 'react-toastify';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const ResultsPage = () => {
  const { 
    questions, 
    userAnswers, 
    quizCompleted, 
    selectedCategory,
    calculateScore,
    resetQuiz,
    username
  } = useQuiz();
  
  const [score, setScore] = useState(null);
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!username) {
      toast.error('Please enter your name first');
      navigate('/');
      return;
    }
    
    if (!quizCompleted) {
      navigate('/categories');
      return;
    }
    
    setScore(calculateScore());
  }, [quizCompleted, calculateScore, navigate, username]);

  const handleRetakeQuiz = () => {
    resetQuiz();
    navigate('/categories');
  };

  const handleGoHome = () => {
    resetQuiz();
    navigate('/');
  };

  const handleShareResult = () => {
    const text = `I scored ${score?.percentage}% (${score?.correctAnswers}/${score?.totalQuestions}) on the ${selectedCategory?.name} quiz in QuizMaster!`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Quiz Result',
        text: text,
      }).catch(err => {
        console.error('Error sharing:', err);
        toast.error('Could not share results');
      });
    } else {
      navigator.clipboard.writeText(text)
        .then(() => toast.success('Result copied to clipboard!'))
        .catch(() => toast.error('Could not copy to clipboard'));
    }
  };

  const handleExportPDF = () => {
    const resultElement = document.getElementById('result-summary');
    
    if (!resultElement) {
      toast.error('Could not generate PDF');
      return;
    }
    
    toast.info('Generating PDF...');
    
    html2canvas(resultElement).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`QuizMaster_${selectedCategory?.name}_Result.pdf`);
      
      toast.success('PDF downloaded successfully!');
    });
  };

  const toggleShowAllQuestions = () => {
    setShowAllQuestions(!showAllQuestions);
  };

  const getRemarkText = (percentage) => {
    if (percentage >= 90) return 'Excellent! You\'re a master!';
    if (percentage >= 80) return 'Great job! Almost perfect!';
    if (percentage >= 70) return 'Good work! You know your stuff!';
    if (percentage >= 60) return 'Not bad! Keep learning!';
    if (percentage >= 50) return 'You passed, but there\'s room for improvement.';
    return 'Keep studying and try again!';
  };

  const getRemarkColor = (percentage) => {
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'error';
  };

  const chartData = {
    labels: ['Correct', 'Incorrect'],
    datasets: [
      {
        data: [score?.correctAnswers, score?.totalQuestions - score?.correctAnswers],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  if (!score) {
    return <LoadingContainer>Loading results...</LoadingContainer>;
  }

  return (
    <ResultsContainer>
      <ResultsHeader>
        <Title>Quiz Results</Title>
        <Subtitle>{selectedCategory?.name} Quiz</Subtitle>
      </ResultsHeader>

      <ResultSummary id="result-summary">
        <ScoreCard>
          <TrophyIcon percentage={score.percentage}>
            <FaTrophy />
          </TrophyIcon>
          <ScoreTitle>Your Score</ScoreTitle>
          <ScoreValue>{score.percentage}%</ScoreValue>
          <ScoreDetails>
            {score.correctAnswers} out of {score.totalQuestions} correct
          </ScoreDetails>
          <RemarkText color={getRemarkColor(score.percentage)}>
            {getRemarkText(score.percentage)}
          </RemarkText>
        </ScoreCard>

        <AnalyticsCard>
          <CardHeader>
            <CardTitle>Performance Analysis</CardTitle>
          </CardHeader>
          <CardBody>
            <ChartContainer>
              <Pie data={chartData} />
            </ChartContainer>
            <StatsList>
              <StatItem>
                <StatLabel>Correct Answers:</StatLabel>
                <StatValue color="success">{score.correctAnswers} ({Math.round((score.correctAnswers / score.totalQuestions) * 100)}%)</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Incorrect Answers:</StatLabel>
                <StatValue color="error">{score.totalQuestions - score.correctAnswers} ({Math.round(((score.totalQuestions - score.correctAnswers) / score.totalQuestions) * 100)}%)</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Total Questions:</StatLabel>
                <StatValue>{score.totalQuestions}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Category:</StatLabel>
                <StatValue>{selectedCategory?.name}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Difficulty:</StatLabel>
                <StatValue>{selectedCategory?.difficulty}</StatValue>
              </StatItem>
            </StatsList>
          </CardBody>
        </AnalyticsCard>
      </ResultSummary>

      <ActionsContainer>
        <Button 
          variant="primary" 
          icon={<FaRedo />} 
          onClick={handleRetakeQuiz}
        >
          Retake Quiz
        </Button>
        <Button 
          variant="outline" 
          icon={<FaHome />} 
          onClick={handleGoHome}
        >
          Go Home
        </Button>
        <Button 
          variant="secondary" 
          icon={<FaShare />} 
          onClick={handleShareResult}
        >
          Share Result
        </Button>
        <Button 
          variant="outline" 
          icon={<FaFilePdf />} 
          onClick={handleExportPDF}
        >
          Export PDF
        </Button>
      </ActionsContainer>

      <ReviewSection>
        <ReviewHeader>
          <ReviewTitle>Review Your Answers</ReviewTitle>
          <Button 
            variant="text" 
            onClick={toggleShowAllQuestions}
          >
            {showAllQuestions ? 'Show Summary' : 'Show All Questions'}
          </Button>
        </ReviewHeader>

        {showAllQuestions ? (
          <QuestionsContainer>
            {questions.map((question, index) => (
              <QuestionCard 
                key={index}
                question={question}
                questionIndex={index}
                showAnswer={true}
                reviewMode={true}
              />
            ))}
          </QuestionsContainer>
        ) : (
          <SummaryContainer>
            <SummaryCard>
              <CardHeader>
                <CardTitle>Correct Answers</CardTitle>
              </CardHeader>
              <CardBody>
                <AnswersList>
                  {questions.map((question, index) => {
                    const isCorrect = question.type === 'checkbox'
                      ? userAnswers[index] && 
                        Array.isArray(userAnswers[index]) && 
                        Array.isArray(question.correctAnswer) && 
                        userAnswers[index].length === question.correctAnswer.length && 
                        userAnswers[index].every(ans => question.correctAnswer.includes(ans))
                      : userAnswers[index] === question.correctAnswer;
                    
                    if (isCorrect) {
                      return (
                        <AnswerItem key={index} correct={true}>
                          <AnswerIcon>
                            <FaCheck />
                          </AnswerIcon>
                          <AnswerText>{question.question}</AnswerText>
                        </AnswerItem>
                      );
                    }
                    return null;
                  })}
                </AnswersList>
              </CardBody>
            </SummaryCard>

            <SummaryCard>
              <CardHeader>
                <CardTitle>Incorrect Answers</CardTitle>
              </CardHeader>
              <CardBody>
                <AnswersList>
                  {questions.map((question, index) => {
                    const isCorrect = question.type === 'checkbox'
                      ? userAnswers[index] && 
                        Array.isArray(userAnswers[index]) && 
                        Array.isArray(question.correctAnswer) && 
                        userAnswers[index].length === question.correctAnswer.length && 
                        userAnswers[index].every(ans => question.correctAnswer.includes(ans))
                      : userAnswers[index] === question.correctAnswer;
                    
                    if (!isCorrect) {
                      return (
                        <AnswerItem key={index} correct={false}>
                          <AnswerIcon>
                            <FaTimes />
                          </AnswerIcon>
                          <AnswerText>{question.question}</AnswerText>
                          <CorrectAnswerText>
                            Correct: {Array.isArray(question.correctAnswer) 
                              ? question.correctAnswer.join(', ') 
                              : question.correctAnswer}
                          </CorrectAnswerText>
                        </AnswerItem>
                      );
                    }
                    return null;
                  })}
                </AnswersList>
              </CardBody>
            </SummaryCard>
          </SummaryContainer>
        )}
      </ReviewSection>
    </ResultsContainer>
  );
};

const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ResultsHeader = styled.div`
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

const ResultSummary = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ScoreCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
`;

const TrophyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: ${props => {
    if (props.percentage >= 80) return props.theme.success;
    if (props.percentage >= 60) return props.theme.warning;
    return props.theme.error;
  }};
`;

const ScoreTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const ScoreValue = styled.div`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.primary};
`;

const ScoreDetails = styled.div`
  font-size: 1rem;
  margin-bottom: 1rem;
  opacity: 0.8;
`;

const RemarkText = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => {
    switch (props.color) {
      case 'success':
        return props.theme.success;
      case 'warning':
        return props.theme.warning;
      case 'error':
        return props.theme.error;
      default:
        return props.theme.text;
    }
  }};
`;

const AnalyticsCard = styled(Card)``;

const ChartContainer = styled.div`
  max-width: 300px;
  margin: 0 auto 2rem;
`;

const StatsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  
  &:last-child {
    border-bottom: none;
  }
`;

const StatLabel = styled.span`
  font-weight: 500;
`;

const StatValue = styled.span`
  color: ${props => {
    switch (props.color) {
      case 'success':
        return props.theme.success;
      case 'error':
        return props.theme.error;
      default:
        return props.theme.text;
    }
  }};
  font-weight: ${props => props.color ? 600 : 400};
`;

const ActionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin: 1rem 0;
  
  @media (max-width: 768px) {
    flex-direction: column;
    
    button {
      width: 100%;
    }
  }
`;

const ReviewSection = styled.div`
  margin-top: 2rem;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ReviewTitle = styled.h2`
  font-size: 1.5rem;
  margin: 0;
  color: ${props => props.theme.primary};
`;

const QuestionsContainer = styled.div``;

const SummaryContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryCard = styled(Card)`
  height: 100%;
`;

const AnswersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const AnswerItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 1rem;
  border-radius: 8px;
  background-color: ${props => props.correct 
    ? `${props.theme.success}10` 
    : `${props.theme.error}10`
  };
  border: 1px solid ${props => props.correct 
    ? props.theme.success 
    : props.theme.error
  };
`;

const AnswerIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  color: ${props => props.theme.isDark ? props.theme.text : props.theme.primary};
`;

const AnswerText = styled.div`
  flex: 1;
`;

const CorrectAnswerText = styled.div`
  margin-top: 0.5rem;
  font-size: 0.9rem;
  font-style: italic;
  color: ${props => props.theme.success};
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  font-size: 1.2rem;
  color: ${props => props.theme.primary};
`;

export default ResultsPage;