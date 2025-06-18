import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaUsers, FaQuestionCircle, FaTrophy, FaChartLine, FaCog, FaDatabase } from 'react-icons/fa';
import Card, { CardHeader, CardTitle, CardBody } from '../../components/ui/Card';
import { useQuiz } from '../../contexts/QuizContext';
import { useNavigate } from 'react-router-dom';
import { getFromLocalStorage } from '../../utils/storage';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';

const AdminDashboard = () => {
  const { username } = useQuiz();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuizzes: 0,
    totalQuestions: 0,
    totalCategories: 0,
    recentActivity: []
  });
  
  useEffect(() => {
    // Check if user is admin
    const isAdmin = username === 'admin' || getFromLocalStorage('isAdmin', false);
    if (!isAdmin) {
      navigate('/');
      return;
    }
    
    // Load dashboard stats
    const loadStats = () => {
      // In a real app, this would be an API call
      // For now, we'll use mock data
      const users = getFromLocalStorage('users', []);
      const quizzes = getFromLocalStorage('customQuizzes', []);
      const categories = getFromLocalStorage('categories', []);
      const leaderboard = getFromLocalStorage('leaderboard', []);
      
      // Calculate total questions across all quizzes
      const totalQuestions = quizzes.reduce((sum, quiz) => sum + (quiz.questions?.length || 0), 0);
      
      // Get recent activity
      const recentActivity = [...leaderboard]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
      
      setStats({
        totalUsers: users.length,
        totalQuizzes: quizzes.length,
        totalQuestions,
        totalCategories: categories.length,
        recentActivity
      });
    };
    
    loadStats();
  }, [username, navigate]);
  
  return (
    <AdminLayout>
      <AdminSidebar />
      <MainContent>
        <AdminHeader title="Dashboard" />
        
        <DashboardContent>
          <StatsGrid>
            <StatCard>
              <StatIcon>
                <FaUsers />
              </StatIcon>
              <StatContent>
                <StatValue>{stats.totalUsers}</StatValue>
                <StatLabel>Total Users</StatLabel>
              </StatContent>
            </StatCard>
            
            <StatCard>
              <StatIcon>
                <FaQuestionCircle />
              </StatIcon>
              <StatContent>
                <StatValue>{stats.totalQuizzes}</StatValue>
                <StatLabel>Total Quizzes</StatLabel>
              </StatContent>
            </StatCard>
            
            <StatCard>
              <StatIcon>
                <FaDatabase />
              </StatIcon>
              <StatContent>
                <StatValue>{stats.totalQuestions}</StatValue>
                <StatLabel>Total Questions</StatLabel>
              </StatContent>
            </StatCard>
            
            <StatCard>
              <StatIcon>
                <FaTrophy />
              </StatIcon>
              <StatContent>
                <StatValue>{stats.totalCategories}</StatValue>
                <StatLabel>Categories</StatLabel>
              </StatContent>
            </StatCard>
          </StatsGrid>
          
          <DashboardGrid>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardBody>
                {stats.recentActivity.length > 0 ? (
                  <ActivityList>
                    {stats.recentActivity.map((activity, index) => (
                      <ActivityItem key={index}>
                        <ActivityUser>{activity.username}</ActivityUser>
                        <ActivityDetails>
                          completed <strong>{activity.categoryName}</strong> quiz with score
                        </ActivityDetails>
                        <ActivityScore>{activity.score}%</ActivityScore>
                        <ActivityTime>
                          {new Date(activity.date).toLocaleString()}
                        </ActivityTime>
                      </ActivityItem>
                    ))}
                  </ActivityList>
                ) : (
                  <EmptyState>No recent activity</EmptyState>
                )}
              </CardBody>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardBody>
                <StatusList>
                  <StatusItem>
                    <StatusLabel>Database</StatusLabel>
                    <StatusValue status="healthy">Healthy</StatusValue>
                  </StatusItem>
                  <StatusItem>
                    <StatusLabel>API</StatusLabel>
                    <StatusValue status="healthy">Operational</StatusValue>
                  </StatusItem>
                  <StatusItem>
                    <StatusLabel>Storage</StatusLabel>
                    <StatusValue status="warning">80% Used</StatusValue>
                  </StatusItem>
                  <StatusItem>
                    <StatusLabel>Cache</StatusLabel>
                    <StatusValue status="healthy">Optimized</StatusValue>
                  </StatusItem>
                  <StatusItem>
                    <StatusLabel>Last Backup</StatusLabel>
                    <StatusValue status="healthy">Today, 03:00 AM</StatusValue>
                  </StatusItem>
                </StatusList>
              </CardBody>
            </Card>
          </DashboardGrid>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardBody>
              <QuickActions>
                <ActionButton onClick={() => navigate('/admin/users')}>
                  <ActionIcon>
                    <FaUsers />
                  </ActionIcon>
                  <ActionText>Manage Users</ActionText>
                </ActionButton>
                
                <ActionButton onClick={() => navigate('/admin/quizzes')}>
                  <ActionIcon>
                    <FaQuestionCircle />
                  </ActionIcon>
                  <ActionText>Manage Quizzes</ActionText>
                </ActionButton>
                
                <ActionButton onClick={() => navigate('/admin/categories')}>
                  <ActionIcon>
                    <FaDatabase />
                  </ActionIcon>
                  <ActionText>Manage Categories</ActionText>
                </ActionButton>
                
                <ActionButton onClick={() => navigate('/admin/analytics')}>
                  <ActionIcon>
                    <FaChartLine />
                  </ActionIcon>
                  <ActionText>View Analytics</ActionText>
                </ActionButton>
                
                <ActionButton onClick={() => navigate('/admin/settings')}>
                  <ActionIcon>
                    <FaCog />
                  </ActionIcon>
                  <ActionText>System Settings</ActionText>
                </ActionButton>
              </QuickActions>
            </CardBody>
          </Card>
        </DashboardContent>
      </MainContent>
    </AdminLayout>
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

const DashboardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
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

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ActivityItem = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
  border-radius: 4px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
  }
`;

const ActivityUser = styled.div`
  font-weight: 500;
  color: ${props => props.theme.primary};
`;

const ActivityDetails = styled.div`
  font-size: 0.9rem;
`;

const ActivityScore = styled.div`
  font-weight: 600;
  color: ${props => props.theme.success};
`;

const ActivityTime = styled.div`
  font-size: 0.8rem;
  opacity: 0.7;
  white-space: nowrap;
  
  @media (max-width: 768px) {
    grid-column: 2;
    text-align: right;
  }
`;

const StatusList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const StatusItem = styled.div`
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

const StatusLabel = styled.div`
  font-weight: 500;
`;

const StatusValue = styled.div`
  font-weight: 500;
  color: ${props => {
    switch (props.status) {
      case 'healthy': return props.theme.success;
      case 'warning': return props.theme.warning;
      case 'error': return props.theme.error;
      default: return props.theme.text;
    }
  }};
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const ActionButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
  border: 1px solid ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => `${props.theme.primary}10`};
    transform: translateY(-2px);
  }
`;

const ActionIcon = styled.div`
  font-size: 2rem;
  color: ${props => props.theme.primary};
  margin-bottom: 0.75rem;
`;

const ActionText = styled.div`
  font-weight: 500;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  opacity: 0.7;
`;

export default AdminDashboard;