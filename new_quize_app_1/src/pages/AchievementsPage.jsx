import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTrophy, FaLock, FaMedal, FaCrown, FaClock, FaBook, FaPencilAlt, FaStar, FaShare, FaGem, FaBolt } from 'react-icons/fa';
import Card, { CardHeader, CardTitle, CardBody } from '../components/ui/Card';
import { ACHIEVEMENTS, getUserAchievements } from '../utils/achievements';
import { useLanguage } from '../contexts/LanguageContext';

const AchievementsPage = () => {
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const { t } = useLanguage();
  
  useEffect(() => {
    const achievements = getUserAchievements();
    setUnlockedAchievements(achievements);
  }, []);
  
  const getAchievementIcon = (iconName) => {
    switch (iconName) {
      case 'trophy': return <FaTrophy />;
      case 'crown': return <FaCrown />;
      case 'clock': return <FaClock />;
      case 'medal': return <FaMedal />;
      case 'book': return <FaBook />;
      case 'pencil': return <FaPencilAlt />;
      case 'star': return <FaStar />;
      case 'share': return <FaShare />;
      case 'diamond': return <FaGem />;
      case 'bolt': return <FaBolt />;
      default: return <FaTrophy />;
    }
  };
  
  return (
    <PageContainer>
      <PageHeader>
        <Title>Achievements</Title>
        <Subtitle>Track your progress and unlock special achievements</Subtitle>
      </PageHeader>
      
      <StatsCard>
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
        </CardHeader>
        <CardBody>
          <StatsContainer>
            <StatItem>
              <StatValue>{unlockedAchievements.length}</StatValue>
              <StatLabel>Unlocked</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{ACHIEVEMENTS.length - unlockedAchievements.length}</StatValue>
              <StatLabel>Locked</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{Math.round((unlockedAchievements.length / ACHIEVEMENTS.length) * 100)}%</StatValue>
              <StatLabel>Complete</StatLabel>
            </StatItem>
          </StatsContainer>
        </CardBody>
      </StatsCard>
      
      <AchievementsGrid>
        {ACHIEVEMENTS.map(achievement => {
          const isUnlocked = unlockedAchievements.includes(achievement.id);
          
          return (
            <AchievementCard key={achievement.id} unlocked={isUnlocked}>
              <AchievementIcon unlocked={isUnlocked}>
                {isUnlocked ? getAchievementIcon(achievement.icon) : <FaLock />}
              </AchievementIcon>
              <AchievementContent>
                <AchievementName unlocked={isUnlocked}>
                  {achievement.name}
                </AchievementName>
                <AchievementDescription>
                  {achievement.description}
                </AchievementDescription>
              </AchievementContent>
            </AchievementCard>
          );
        })}
      </AchievementsGrid>
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

const StatsCard = styled(Card)`
  margin-bottom: 1rem;
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  text-align: center;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.theme.primary};
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
  margin-top: 0.25rem;
`;

const AchievementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const AchievementCard = styled.div`
  display: flex;
  align-items: center;
  padding: 1.5rem;
  background-color: ${props => props.theme.surface};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  opacity: ${props => props.unlocked ? 1 : 0.7};
  
  &:hover {
    transform: translateY(-3px);
  }
`;

const AchievementIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${props => props.unlocked ? props.theme.primary : props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  color: ${props => props.unlocked ? 'white' : props.theme.text};
  margin-right: 1rem;
  font-size: 1.5rem;
`;

const AchievementContent = styled.div`
  flex: 1;
`;

const AchievementName = styled.h3`
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
  color: ${props => props.unlocked ? props.theme.primary : props.theme.text};
`;

const AchievementDescription = styled.p`
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.8;
`;

export default AchievementsPage;