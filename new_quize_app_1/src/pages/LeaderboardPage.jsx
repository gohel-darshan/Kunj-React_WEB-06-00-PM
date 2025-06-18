import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTrophy, FaMedal, FaAward, FaFilter, FaCalendarAlt, FaUser } from 'react-icons/fa';
import Card, { CardHeader, CardTitle, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useQuiz } from '../contexts/QuizContext';
import { formatDate } from '../utils/helpers';

const LeaderboardPage = () => {
  const { getLeaderboard, categories } = useQuiz();
  const [leaderboard, setLeaderboard] = useState([]);
  const [filteredLeaderboard, setFilteredLeaderboard] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('score'); // 'score', 'date'

  useEffect(() => {
    // Get all leaderboard entries
    const allEntries = getLeaderboard();
    setLeaderboard(allEntries);
    setFilteredLeaderboard(allEntries);
  }, [getLeaderboard]);

  useEffect(() => {
    // Filter and sort leaderboard
    let filtered = [...leaderboard];
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(entry => entry.categoryId === selectedCategory);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'score') {
        return b.score - a.score;
      } else if (sortBy === 'date') {
        return new Date(b.date) - new Date(a.date);
      }
      return 0;
    });
    
    setFilteredLeaderboard(filtered);
  }, [leaderboard, selectedCategory, sortBy]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleSortChange = (sortType) => {
    setSortBy(sortType);
  };

  const getPositionIcon = (index) => {
    switch (index) {
      case 0:
        return <FaTrophy style={{ color: 'gold' }} />;
      case 1:
        return <FaMedal style={{ color: 'silver' }} />;
      case 2:
        return <FaAward style={{ color: '#cd7f32' }} />;
      default:
        return <span>{index + 1}</span>;
    }
  };

  return (
    <LeaderboardContainer>
      <PageHeader>
        <Title>Leaderboard</Title>
        <Subtitle>See how you rank against other players</Subtitle>
      </PageHeader>

      <FiltersContainer>
        <FilterGroup>
          <FilterLabel>
            <FaFilter />
            <span>Category:</span>
          </FilterLabel>
          <FilterButtons>
            <FilterButton 
              variant={selectedCategory === 'all' ? 'primary' : 'outline'} 
              size="small"
              onClick={() => handleCategoryChange('all')}
            >
              All Categories
            </FilterButton>
            {categories.map(category => (
              <FilterButton 
                key={category.id}
                variant={selectedCategory === category.id ? 'primary' : 'outline'} 
                size="small"
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name}
              </FilterButton>
            ))}
          </FilterButtons>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>
            <FaFilter />
            <span>Sort by:</span>
          </FilterLabel>
          <FilterButtons>
            <FilterButton 
              variant={sortBy === 'score' ? 'primary' : 'outline'} 
              size="small"
              onClick={() => handleSortChange('score')}
            >
              Highest Score
            </FilterButton>
            <FilterButton 
              variant={sortBy === 'date' ? 'primary' : 'outline'} 
              size="small"
              onClick={() => handleSortChange('date')}
            >
              Most Recent
            </FilterButton>
          </FilterButtons>
        </FilterGroup>
      </FiltersContainer>

      <LeaderboardCard>
        <CardHeader>
          <CardTitle>
            {selectedCategory === 'all' 
              ? 'All Categories' 
              : `${categories.find(c => c.id === selectedCategory)?.name || ''} Category`
            }
          </CardTitle>
        </CardHeader>
        <CardBody>
          {filteredLeaderboard.length > 0 ? (
            <LeaderboardTable>
              <LeaderboardHeader>
                <HeaderCell width="10%">Rank</HeaderCell>
                <HeaderCell width="25%">Player</HeaderCell>
                <HeaderCell width="20%">Category</HeaderCell>
                <HeaderCell width="15%">Score</HeaderCell>
                <HeaderCell width="15%">Correct</HeaderCell>
                <HeaderCell width="15%">Date</HeaderCell>
              </LeaderboardHeader>
              <LeaderboardBody>
                {filteredLeaderboard.map((entry, index) => (
                  <LeaderboardRow key={`${entry.username}-${entry.date}-${index}`}>
                    <Cell>
                      <RankContainer>
                        {getPositionIcon(index)}
                      </RankContainer>
                    </Cell>
                    <Cell>
                      <PlayerInfo>
                        <PlayerIcon>
                          <FaUser />
                        </PlayerIcon>
                        <PlayerName>{entry.username}</PlayerName>
                      </PlayerInfo>
                    </Cell>
                    <Cell>{entry.categoryName}</Cell>
                    <Cell>
                      <ScoreBadge score={entry.score}>
                        {entry.score}%
                      </ScoreBadge>
                    </Cell>
                    <Cell>{entry.correctAnswers}/{entry.totalQuestions}</Cell>
                    <Cell>
                      <DateInfo>
                        <FaCalendarAlt />
                        <span>{formatDate(entry.date)}</span>
                      </DateInfo>
                    </Cell>
                  </LeaderboardRow>
                ))}
              </LeaderboardBody>
            </LeaderboardTable>
          ) : (
            <EmptyState>
              <EmptyMessage>No leaderboard entries found</EmptyMessage>
              <EmptyDescription>
                Complete a quiz to see your name on the leaderboard!
              </EmptyDescription>
            </EmptyState>
          )}
        </CardBody>
      </LeaderboardCard>
    </LeaderboardContainer>
  );
};

const LeaderboardContainer = styled.div`
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

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FilterLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  
  svg {
    color: ${props => props.theme.primary};
  }
`;

const FilterButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const FilterButton = styled(Button)`
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
`;

const LeaderboardCard = styled(Card)``;

const LeaderboardTable = styled.div`
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  
  @media (max-width: 768px) {
    display: block;
    overflow-x: auto;
  }
`;

const LeaderboardHeader = styled.div`
  display: flex;
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'};
  padding: 1rem;
  font-weight: 600;
`;

const HeaderCell = styled.div`
  width: ${props => props.width || 'auto'};
  padding: 0 0.5rem;
`;

const LeaderboardBody = styled.div``;

const LeaderboardRow = styled.div`
  display: flex;
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)'};
  }
`;

const Cell = styled.div`
  width: ${props => props.width || 'auto'};
  padding: 0 0.5rem;
  display: flex;
  align-items: center;
`;

const RankContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'};
  font-weight: 600;
  
  svg {
    font-size: 1.2rem;
  }
`;

const PlayerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const PlayerIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: ${props => props.theme.primary};
  color: white;
`;

const PlayerName = styled.div`
  font-weight: 500;
`;

const ScoreBadge = styled.div`
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 600;
  background-color: ${props => {
    if (props.score >= 80) return `${props.theme.success}20`;
    if (props.score >= 60) return `${props.theme.warning}20`;
    return `${props.theme.error}20`;
  }};
  color: ${props => {
    if (props.score >= 80) return props.theme.success;
    if (props.score >= 60) return props.theme.warning;
    return props.theme.error;
  }};
`;

const DateInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  
  svg {
    opacity: 0.7;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
`;

const EmptyMessage = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.primary};
`;

const EmptyDescription = styled.p`
  opacity: 0.7;
`;

export default LeaderboardPage;