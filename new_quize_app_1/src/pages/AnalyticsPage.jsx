import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaChartBar, FaChartPie, FaChartLine, FaCalendarAlt, FaFilter } from 'react-icons/fa';
import Card, { CardHeader, CardTitle, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { getLeaderboard } from '../utils/storage';
import { getUserStats } from '../utils/achievements';
import { useLanguage } from '../contexts/LanguageContext';

const AnalyticsPage = () => {
  const [quizData, setQuizData] = useState([]);
  const [userStats, setUserStats] = useState({});
  const [timeFilter, setTimeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categories, setCategories] = useState([]);
  const { t } = useLanguage();
  
  useEffect(() => {
    // Load quiz data
    const leaderboard = getLeaderboard();
    setQuizData(leaderboard);
    
    // Extract unique categories
    const uniqueCategories = [...new Set(leaderboard.map(entry => entry.categoryId))];
    setCategories(uniqueCategories);
    
    // Load user stats
    const stats = getUserStats();
    setUserStats(stats);
  }, []);
  
  // Filter data based on selected filters
  const getFilteredData = () => {
    let filtered = [...quizData];
    
    // Apply time filter
    if (timeFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (timeFilter) {
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          break;
      }
      
      filtered = filtered.filter(entry => new Date(entry.date) >= filterDate);
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(entry => entry.categoryId === categoryFilter);
    }
    
    return filtered;
  };
  
  const filteredData = getFilteredData();
  
  // Calculate average score
  const averageScore = filteredData.length > 0
    ? Math.round(filteredData.reduce((sum, entry) => sum + entry.score, 0) / filteredData.length)
    : 0;
  
  // Calculate category performance
  const getCategoryPerformance = () => {
    const performance = {};
    
    categories.forEach(category => {
      const categoryEntries = filteredData.filter(entry => entry.categoryId === category);
      if (categoryEntries.length > 0) {
        const avgScore = Math.round(
          categoryEntries.reduce((sum, entry) => sum + entry.score, 0) / categoryEntries.length
        );
        performance[category] = {
          name: categoryEntries[0].categoryName,
          score: avgScore,
          count: categoryEntries.length
        };
      }
    });
    
    return performance;
  };
  
  const categoryPerformance = getCategoryPerformance();
  
  // Get best and worst categories
  const getBestAndWorstCategories = () => {
    const categories = Object.values(categoryPerformance);
    if (categories.length === 0) return { best: null, worst: null };
    
    categories.sort((a, b) => b.score - a.score);
    return {
      best: categories[0],
      worst: categories[categories.length - 1]
    };
  };
  
  const { best, worst } = getBestAndWorstCategories();
  
  return (
    <PageContainer>
      <PageHeader>
        <Title>Analytics Dashboard</Title>
        <Subtitle>Track your quiz performance and progress</Subtitle>
      </PageHeader>
      
      <FiltersContainer>
        <FilterGroup>
          <FilterLabel>
            <FaCalendarAlt /> Time Period
          </FilterLabel>
          <ButtonGroup>
            <FilterButton 
              selected={timeFilter === 'all'} 
              onClick={() => setTimeFilter('all')}
            >
              All Time
            </FilterButton>
            <FilterButton 
              selected={timeFilter === 'week'} 
              onClick={() => setTimeFilter('week')}
            >
              Last Week
            </FilterButton>
            <FilterButton 
              selected={timeFilter === 'month'} 
              onClick={() => setTimeFilter('month')}
            >
              Last Month
            </FilterButton>
            <FilterButton 
              selected={timeFilter === 'year'} 
              onClick={() => setTimeFilter('year')}
            >
              Last Year
            </FilterButton>
          </ButtonGroup>
        </FilterGroup>
        
        <FilterGroup>
          <FilterLabel>
            <FaFilter /> Category
          </FilterLabel>
          <Select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {quizData.find(entry => entry.categoryId === category)?.categoryName || category}
              </option>
            ))}
          </Select>
        </FilterGroup>
      </FiltersContainer>
      
      <StatsGrid>
        <StatCard>
          <StatIcon>
            <FaChartBar />
          </StatIcon>
          <StatContent>
            <StatValue>{filteredData.length}</StatValue>
            <StatLabel>Quizzes Completed</StatLabel>
          </StatContent>
        </StatCard>
        
        <StatCard>
          <StatIcon>
            <FaChartPie />
          </StatIcon>
          <StatContent>
            <StatValue>{averageScore}%</StatValue>
            <StatLabel>Average Score</StatLabel>
          </StatContent>
        </StatCard>
        
        <StatCard>
          <StatIcon>
            <FaChartLine />
          </StatIcon>
          <StatContent>
            <StatValue>{userStats.perfectScores || 0}</StatValue>
            <StatLabel>Perfect Scores</StatLabel>
          </StatContent>
        </StatCard>
      </StatsGrid>
      
      <AnalyticsGrid>
        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
          </CardHeader>
          <CardBody>
            {Object.keys(categoryPerformance).length > 0 ? (
              <CategoryList>
                {Object.values(categoryPerformance)
                  .sort((a, b) => b.score - a.score)
                  .map(category => (
                    <CategoryItem key={category.name}>
                      <CategoryName>{category.name}</CategoryName>
                      <CategoryScore>
                        <ScoreBar score={category.score}>
                          <ScoreValue>{category.score}%</ScoreValue>
                        </ScoreBar>
                      </CategoryScore>
                      <CategoryCount>{category.count} quizzes</CategoryCount>
                    </CategoryItem>
                  ))
                }
              </CategoryList>
            ) : (
              <EmptyState>No category data available</EmptyState>
            )}
          </CardBody>
        </Card>
        
        <PerformanceCard>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
          </CardHeader>
          <CardBody>
            {filteredData.length > 0 ? (
              <InsightsList>
                <InsightItem>
                  <InsightTitle>Total Quizzes</InsightTitle>
                  <InsightValue>{filteredData.length}</InsightValue>
                </InsightItem>
                
                <InsightItem>
                  <InsightTitle>Average Score</InsightTitle>
                  <InsightValue>{averageScore}%</InsightValue>
                </InsightItem>
                
                {best && (
                  <InsightItem>
                    <InsightTitle>Best Category</InsightTitle>
                    <InsightValue>{best.name} ({best.score}%)</InsightValue>
                  </InsightItem>
                )}
                
                {worst && best?.name !== worst?.name && (
                  <InsightItem>
                    <InsightTitle>Needs Improvement</InsightTitle>
                    <InsightValue>{worst.name} ({worst.score}%)</InsightValue>
                  </InsightItem>
                )}
                
                <InsightItem>
                  <InsightTitle>Perfect Scores</InsightTitle>
                  <InsightValue>{userStats.perfectScores || 0}</InsightValue>
                </InsightItem>
                
                <InsightItem>
                  <InsightTitle>Quick Completions</InsightTitle>
                  <InsightValue>{userStats.quickCompletions || 0}</InsightValue>
                </InsightItem>
              </InsightsList>
            ) : (
              <EmptyState>No performance data available</EmptyState>
            )}
          </CardBody>
        </PerformanceCard>
      </AnalyticsGrid>
      
      <RecentActivity>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardBody>
            {filteredData.length > 0 ? (
              <ActivityList>
                {filteredData
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .slice(0, 5)
                  .map((activity, index) => (
                    <ActivityItem key={index}>
                      <ActivityCategory>{activity.categoryName}</ActivityCategory>
                      <ActivityScore score={activity.score}>{activity.score}%</ActivityScore>
                      <ActivityDate>
                        {new Date(activity.date).toLocaleDateString()}
                      </ActivityDate>
                    </ActivityItem>
                  ))
                }
              </ActivityList>
            ) : (
              <EmptyState>No recent activity</EmptyState>
            )}
          </CardBody>
        </Card>
      </RecentActivity>
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

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const FilterButton = styled.button`
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

const Select = styled.select`
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
  color: ${props => props.theme.text};
  font-size: 1rem;
  min-width: 200px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  display: flex;
  align-items: center;
  padding: 1.5rem;
  background-color: ${props => props.theme.surface};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StatIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${props => `${props.theme.primary}20`};
  color: ${props => props.theme.primary};
  margin-right: 1rem;
  font-size: 1.5rem;
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: bold;
  color: ${props => props.theme.primary};
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const AnalyticsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CategoryItem = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 0.5fr;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
`;

const CategoryName = styled.div`
  font-weight: 500;
`;

const CategoryScore = styled.div`
  width: 100%;
  height: 24px;
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 12px;
  overflow: hidden;
`;

const ScoreBar = styled.div`
  height: 100%;
  width: ${props => `${props.score}%`};
  background-color: ${props => {
    if (props.score >= 80) return props.theme.success;
    if (props.score >= 60) return props.theme.primary;
    if (props.score >= 40) return props.theme.warning;
    return props.theme.error;
  }};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 0.5rem;
`;

const ScoreValue = styled.div`
  color: white;
  font-size: 0.8rem;
  font-weight: 500;
`;

const CategoryCount = styled.div`
  font-size: 0.8rem;
  opacity: 0.7;
  text-align: right;
  
  @media (max-width: 768px) {
    text-align: left;
  }
`;

const PerformanceCard = styled(Card)`
  height: 100%;
`;

const InsightsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InsightItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const InsightTitle = styled.div`
  font-weight: 500;
`;

const InsightValue = styled.div`
  font-weight: 600;
  color: ${props => props.theme.primary};
`;

const RecentActivity = styled.div`
  margin-bottom: 2rem;
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ActivityItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
  border-radius: 4px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

const ActivityCategory = styled.div`
  font-weight: 500;
`;

const ActivityScore = styled.div`
  font-weight: 600;
  color: ${props => {
    if (props.score >= 80) return props.theme.success;
    if (props.score >= 60) return props.theme.primary;
    if (props.score >= 40) return props.theme.warning;
    return props.theme.error;
  }};
`;

const ActivityDate = styled.div`
  font-size: 0.8rem;
  opacity: 0.7;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  opacity: 0.7;
`;

export default AnalyticsPage;