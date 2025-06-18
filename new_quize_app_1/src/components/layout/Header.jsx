import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaQuestionCircle, FaMoon, FaSun, FaBars, FaTimes, FaTrophy, FaUser, FaCog, FaPlus, FaList, FaMedal, FaChartBar, FaShieldAlt } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';
import { useQuiz } from '../../contexts/QuizContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { isAdmin } from '../../utils/adminAuth';

const Header = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { username, quizStarted } = useQuiz();
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    // Check if the current user is an admin
    setIsAdminUser(isAdmin(username));
  }, [username]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <HeaderContainer>
      <LogoContainer>
        <Link to="/" onClick={closeMenu}>
          <Logo>
            <FaQuestionCircle />
            <LogoText>QuizMaster</LogoText>
          </Logo>
        </Link>
      </LogoContainer>

      <MobileMenuButton onClick={toggleMenu}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </MobileMenuButton>

      <NavContainer menuOpen={menuOpen}>
        <NavLinks>
          <NavItem isActive={location.pathname === '/'}>
            <Link to="/" onClick={closeMenu}>Home</Link>
          </NavItem>
          {!quizStarted && (
            <NavItem isActive={location.pathname === '/categories'}>
              <Link to="/categories" onClick={closeMenu}>Categories</Link>
            </NavItem>
          )}
          <NavItem isActive={location.pathname === '/my-quizzes'}>
            <Link to="/my-quizzes" onClick={closeMenu}>
              <FaList /> My Quizzes
            </Link>
          </NavItem>
          <NavItem isActive={location.pathname === '/create-quiz'}>
            <Link to="/create-quiz" onClick={closeMenu}>
              <FaPlus /> Create Quiz
            </Link>
          </NavItem>
          <NavItem isActive={location.pathname === '/leaderboard'}>
            <Link to="/leaderboard" onClick={closeMenu}>
              <FaTrophy /> {t('nav.leaderboard')}
            </Link>
          </NavItem>
          <NavItem isActive={location.pathname === '/achievements'}>
            <Link to="/achievements" onClick={closeMenu}>
              <FaMedal /> Achievements
            </Link>
          </NavItem>
          <NavItem isActive={location.pathname === '/analytics'}>
            <Link to="/analytics" onClick={closeMenu}>
              <FaChartBar /> Analytics
            </Link>
          </NavItem>
          <NavItem isActive={location.pathname === '/settings'}>
            <Link to="/settings" onClick={closeMenu}>
              <FaCog /> {t('nav.settings')}
            </Link>
          </NavItem>
          {isAdminUser && (
            <NavItem isActive={location.pathname.startsWith('/admin')}>
              <Link to="/admin/login" onClick={closeMenu}>
                <FaShieldAlt /> Admin Panel
              </Link>
            </NavItem>
          )}
        </NavLinks>

        <UserControls>
          <ThemeToggle onClick={toggleDarkMode}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </ThemeToggle>
          
          {username && (
            <UserInfo>
              <FaUser />
              <Username>{username}</Username>
            </UserInfo>
          )}
        </UserControls>
      </NavContainer>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: ${props => props.theme.surface};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 100;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.theme.primary};
  
  svg {
    margin-right: 0.5rem;
    font-size: 1.8rem;
  }
`;

const LogoText = styled.span`
  @media (max-width: 480px) {
    display: none;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: ${props => props.theme.text};
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const NavContainer = styled.nav`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: ${props => props.theme.surface};
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    flex-direction: column;
    padding: 1rem;
    transform: ${props => props.menuOpen ? 'translateY(0)' : 'translateY(-100%)'};
    opacity: ${props => props.menuOpen ? 1 : 0};
    visibility: ${props => props.menuOpen ? 'visible' : 'hidden'};
    transition: all 0.3s ease;
    z-index: 99;
  }
`;

const NavLinks = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

const NavItem = styled.li`
  margin: 0 1rem;
  
  a {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: ${props => props.isActive ? props.theme.primary : props.theme.text};
    font-weight: ${props => props.isActive ? 'bold' : 'normal'};
    padding: 0.5rem;
    transition: color 0.2s ease;
    
    &:hover {
      color: ${props => props.theme.primary};
    }
    
    svg {
      margin-right: 0.5rem;
    }
  }
  
  @media (max-width: 768px) {
    margin: 0.5rem 0;
    width: 100%;
    
    a {
      padding: 0.75rem 0;
    }
  }
`;

const UserControls = styled.div`
  display: flex;
  align-items: center;
  margin-left: 2rem;
  
  @media (max-width: 768px) {
    margin-left: 0;
    margin-top: 1rem;
    width: 100%;
    justify-content: center;
  }
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.text};
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.primary};
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-left: 1rem;
  padding: 0.5rem;
  border-radius: 20px;
  background-color: ${props => props.theme.background};
  
  svg {
    margin-right: 0.5rem;
    color: ${props => props.theme.primary};
  }
`;

const Username = styled.span`
  font-weight: 500;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export default Header;