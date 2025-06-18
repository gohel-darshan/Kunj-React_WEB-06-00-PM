import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaChartLine, FaChartBar, FaChartPie, FaCalendarAlt, FaFilter, FaDownload } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import Card, { CardHeader, CardTitle, CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { getFromLocalStorage } from '../../utils/storage';
import { logAdminActivity } from '../../utils/adminAuth';
import { useQuiz } from '../../contexts/QuizContext';

const AdminAnalytics = () => {
  const [timeFilter, setTimeFilter] = useState('month');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categories, setCategories] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({
    userGrowth: [],
    quizCompletions: [],
    categoryPerformance: {},
    topQuizzes: [],
    userActivity: []
  });
  
  const navigate = useNavigate();
  const { username } = useQuiz();
  
  useEffect(() => {
    // Load categories
    const storedCategories = getFromLocalStorage('categories', []);
    setCategories(storedCategories);
    
    // Load analytics data
    loadAnalyticsData();
    
    // Log admin activity
    logAdminActivity(username, 'view_analytics');
  }, [username]);
  
  useEffect(() => {
    // Reload analytics data when filters change
    loadAnalyticsData();
  }, [timeFilter, categoryFilter]);
  
  const loadAnalyticsData = () => {
    // In a real app, this would be an API call with filters
    // For now, we'll generate mock data
    
    // Get date range based on time filter
    const endDate = new Date();
    const startDate = new Date();
    
    switch (timeFilter) {
      case 'week':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(endDate.getMonth() - 1);
    }
    
    // Generate user growth data
    const userGrowth = generateTimeSeriesData(startDate, endDate, 5, 20);
    
    // Generate quiz completions data
    const quizCompletions = generateTimeSeriesData(startDate, endDate, 10, 50);
    
    // Generate category performance data
    const categoryPerformance = {};
    categories.forEach(category => {
      categoryPerformance[category.id] = {
        name: category.name,
        completions: Math.floor(Math.random() * 100) + 20,
        avgScore: Math.floor(Math.random() * 30) + 60,
        avgTime: Math.floor(Math.random() * 5) + 2
      };
    });
    
    // Generate top quizzes data
    const topQuizzes = Array.from({ length: 5 }, (_, i) => ({
      id: `quiz-${i + 1}`,
      name: `Quiz ${i + 1}`,
      category: categories[Math.floor(Math.random() * categories.length)]?.name || 'General',
      completions: Math.floor(Math.random() * 100) + 50,
      avgScore: Math.floor(Math.random() * 20) + 70
    })).sort((a, b) => b.completions - a.completions);
    
    // Generate user activity data
    const userActivity = Array.from({ length: 10 }, (_, i) => ({
      username: `user${i + 1}`,
      quizzesTaken: Math.floor(Math.random() * 20) + 5,
      avgScore: Math.floor(Math.random() * 30) + 60,
      lastActive: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString()
    })).sort((a, b) => b.quizzesTaken - a.quizzesTaken);
    
    setAnalyticsData({
      userGrowth,
      quizCompletions,
      categoryPerformance,
      topQuizzes,
      userActivity
    });
  };
  
  const generateTimeSeriesData = (startDate, endDate, minValue, maxValue) => {
    const data = [];
    const dayDiff = Math.floor((endDate - startDate) / (24 * 60 * 60 * 1000));
    const interval = timeFilter === 'week' ? 1 : timeFilter === 'month' ? 2 : 7;
    
    for (let i = 0; i <= dayDiff; i += interval) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: Math.floor(Math.random() * (maxValue - minValue)) + minValue
      });
    }
    
    return data;
  };
  
  const exportAnalytics = () => {
    // In a real app, this would generate a CSV or PDF
    // For now, we'll just log the data
    console.log('Exporting analytics data:', analyticsData);
    
    // Log admin activity
    logAdminActivity(username, 'export_analytics', { timeFilter, categoryFilter });
    
    alert('Analytics data exported successfully!');
  };
  
  return (
    <AdminLayout>
      <AdminSidebar />
      <MainContent>
        <AdminHeader title="Analytics Dashboard" />
        
        <FiltersContainer>
          <FilterGroup>
            <FilterLabel>
              <FaCalendarAlt /> Time Period
            </FilterLabel>
            <ButtonGroup>
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
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </FilterGroup>
          
          <ExportButton onClick={exportAnalytics}>
            <FaDownload /> Export Data
          </ExportButton>
        </FiltersContainer>
        
        <AnalyticsGrid>
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
            </CardHeader>
            <CardBody>
              <ChartContainer>
                <BarChart data={analyticsData.userGrowth} />
                <ChartLegend>
                  <LegendItem>
                    <LegendColor color="#4a90e2" />
                    <LegendLabel>New Users</LegendLabel>
                  </LegendItem>
                </ChartLegend>
              </ChartContainer>
            </CardBody>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quiz Completions</CardTitle>
            </CardHeader>
            <CardBody>
              <ChartContainer>
                <LineChart data={analyticsData.quizCompletions} />
                <ChartLegend>
                  <LegendItem>
                    <LegendColor color="#4caf50" />
                    <LegendLabel>Completions</LegendLabel>
                  </LegendItem>
                </ChartLegend>
              </ChartContainer>
            </CardBody>
          </Card>
        </AnalyticsGrid>
        
        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
          </CardHeader>
          <CardBody>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>Category</TableHeader>
                    <TableHeader>Completions</TableHeader>
                    <TableHeader>Avg. Score</TableHeader>
                    <TableHeader>Avg. Time (min)</TableHeader>
                    <TableHeader>Performance</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.values(analyticsData.categoryPerformance).map((category, index) => (
                    <TableRow key={index}>
                      <TableCell>{category.name}</TableCell>
                      <TableCell>{category.completions}</TableCell>
                      <TableCell>{category.avgScore}%</TableCell>
                      <TableCell>{category.avgTime}</TableCell>
                      <TableCell>
                        <PerformanceBar value={category.avgScore} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardBody>
        </Card>
        
        <AnalyticsGrid>
          <Card>
            <CardHeader>
              <CardTitle>Top Quizzes</CardTitle>
            </CardHeader>
            <CardBody>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeader>Quiz Name</TableHeader>
                      <TableHeader>Category</TableHeader>
                      <TableHeader>Completions</TableHeader>
                      <TableHeader>Avg. Score</TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {analyticsData.topQuizzes.map((quiz, index) => (
                      <TableRow key={index}>
                        <TableCell>{quiz.name}</TableCell>
                        <TableCell>{quiz.category}</TableCell>
                        <TableCell>{quiz.completions}</TableCell>
                        <TableCell>{quiz.avgScore}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardBody>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
            </CardHeader>
            <CardBody>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeader>Username</TableHeader>
                      <TableHeader>Quizzes Taken</TableHeader>
                      <TableHeader>Avg. Score</TableHeader>
                      <TableHeader>Last Active</TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {analyticsData.userActivity.map((user, index) => (
                      <TableRow key={index}>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.quizzesTaken}</TableCell>
                        <TableCell>{user.avgScore}%</TableCell>
                        <TableCell>{new Date(user.lastActive).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardBody>
          </Card>
        </AnalyticsGrid>
      </MainContent>
    </AdminLayout>
  );
};

// Simplified chart components for demonstration
// In a real app, you would use a library like Chart.js or Recharts

const BarChart = ({ data }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <ChartWrapper>
      {data.map((item, index) => (
        <BarChartBar key={index}>
          <BarChartBarInner 
            height={(item.value / maxValue) * 100} 
            color="#4a90e2"
          />
          <BarChartLabel>{item.date.split('-')[2]}</BarChartLabel>
        </BarChartBar>
      ))}
    </ChartWrapper>
  );
};

const LineChart = ({ data }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - (item.value / maxValue) * 100;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <ChartWrapper>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          points={points}
          fill="none"
          stroke="#4caf50"
          strokeWidth="2"
        />
      </svg>
      <ChartAxisX>
        {data.map((item, index) => (
          <ChartAxisLabel key={index} position={(index / (data.length - 1)) * 100}>
            {item.date.split('-')[2]}
          </ChartAxisLabel>
        ))}
      </ChartAxisX>
    </ChartWrapper>
  );
};

const PerformanceBar = ({ value }) => {
  const getColor = (value) => {
    if (value >= 80) return '#4caf50';
    if (value >= 60) return '#ff9800';
    return '#f44336';
  };
  
  return (
    <PerformanceBarContainer>
      <PerformanceBarInner width={value} color={getColor(value)} />
    </PerformanceBarContainer>
  );
};

const AdminLayout = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  background-color: ${props => props.theme.isDark ? '#1a1a1a' : '#f5f7fa'};
  overflow-y: auto;
`;

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 2rem;
  align-items: flex-end;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
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

const ExportButton = styled(Button)`
  margin-left: auto;
  
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const AnalyticsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartContainer = styled.div`
  height: 300px;
  position: relative;
`;

const ChartWrapper = styled.div`
  width: 100%;
  height: 250px;
  display: flex;
  align-items: flex-end;
  position: relative;
`;

const BarChartBar = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding: 0 2px;
`;

const BarChartBarInner = styled.div`
  width: 100%;
  height: ${props => props.height}%;
  background-color: ${props => props.color};
  border-radius: 2px 2px 0 0;
  transition: height 0.3s ease;
`;

const BarChartLabel = styled.div`
  font-size: 0.8rem;
  margin-top: 0.5rem;
  opacity: 0.7;
`;

const ChartAxisX = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 20px;
`;

const ChartAxisLabel = styled.div`
  position: absolute;
  left: ${props => props.position}%;
  transform: translateX(-50%);
  font-size: 0.8rem;
  opacity: 0.7;
`;

const ChartLegend = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1rem;
`;

const LegendColor = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background-color: ${props => props.color};
  margin-right: 0.5rem;
`;

const LegendLabel = styled.div`
  font-size: 0.9rem;
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableHeader = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
`;

const TableCell = styled.td`
  padding: 1rem;
  vertical-align: middle;
`;

const PerformanceBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 4px;
  overflow: hidden;
`;

const PerformanceBarInner = styled.div`
  height: 100%;
  width: ${props => props.width}%;
  background-color: ${props => props.color};
  border-radius: 4px;
`;

export default AdminAnalytics;