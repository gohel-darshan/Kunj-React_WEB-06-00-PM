import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaQuestionCircle, 
  FaList, 
  FaChartLine, 
  FaCog, 
  FaBars, 
  FaTimes,
  FaDatabase,
  FaClipboardList,
  FaBell
} from 'react-icons/fa';
import { useQuiz } from '../../contexts/QuizContext';

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { username } = useQuiz();
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  
  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const menuItems = [
    { 
      path: '/admin', 
      icon: <FaTachometerAlt />, 
      label: 'Dashboard',
      exact: true
    },
    { 
      path: '/admin/users', 
      icon: <FaUsers />, 
      label: 'Users',
      exact: false
    },
    { 
      path: '/admin/quizzes', 
      icon: <FaQuestionCircle />, 
      label: 'Quizzes',
      exact: false
    },
    { 
      path: '/admin/categories', 
      icon: <FaList />, 
      label: 'Categories',
      exact: false
    },
    { 
      path: '/admin/questions', 
      icon: <FaDatabase />, 
      label: 'Questions',
      exact: false
    },
    { 
      path: '/admin/reports', 
      icon: <FaClipboardList />, 
      label: 'Reports',
      exact: false
    },
    { 
      path: '/admin/analytics', 
      icon: <FaChartLine />, 
      label: 'Analytics',
      exact: false
    },
    { 
      path: '/admin/notifications', 
      icon: <FaBell />, 
      label: 'Notifications',
      exact: false
    },
    { 
      path: '/admin/settings', 
      icon: <FaCog />, 
      label: 'Settings',
      exact: false
    }
  ];
  
  const isActive = (path, exact) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };
  
  return (
    <>
      <MobileToggle onClick={toggleMobileSidebar}>
        {mobileOpen ? <FaTimes /> : <FaBars />}
      </MobileToggle>
      
      <SidebarContainer collapsed={collapsed} mobileOpen={mobileOpen}>
        <SidebarHeader>
          <Logo collapsed={collapsed}>
            {collapsed ? 'QM' : 'QuizMaster'}
          </Logo>
          <CollapseButton onClick={toggleSidebar}>
            {collapsed ? <FaBars /> : <FaTimes />}
          </CollapseButton>
        </SidebarHeader>
        
        <UserInfo collapsed={collapsed}>
          <UserAvatar>
            {username.charAt(0).toUpperCase()}
          </UserAvatar>
          {!collapsed && (
            <UserDetails>
              <UserName>{username}</UserName>
              <UserRole>Administrator</UserRole>
            </UserDetails>
          )}
        </UserInfo>
        
        <MenuContainer>
          {menuItems.map((item) => (
            <MenuItem 
              key={item.path} 
              active={isActive(item.path, item.exact)}
              collapsed={collapsed}
            >
              <MenuLink 
                as={Link} 
                to={item.path}
                onClick={() => setMobileOpen(false)}
              >
                <MenuIcon>{item.icon}</MenuIcon>
                {!collapsed && <MenuLabel>{item.label}</MenuLabel>}
              </MenuLink>
            </MenuItem>
          ))}
        </MenuContainer>
        
        <SidebarFooter collapsed={collapsed}>
          <FooterLink as={Link} to="/">
            <FaQuestionCircle />
            {!collapsed && <span>Back to App</span>}
          </FooterLink>
        </SidebarFooter>
      </SidebarContainer>
      
      {mobileOpen && (
        <Overlay onClick={toggleMobileSidebar} />
      )}
    </>
  );
};

const SidebarContainer = styled.aside`
  display: flex;
  flex-direction: column;
  width: ${props => props.collapsed ? '80px' : '250px'};
  background-color: ${props => props.theme.isDark ? '#121212' : '#ffffff'};
  border-right: 1px solid ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  transition: width 0.3s ease;
  z-index: 100;
  
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    transform: translateX(${props => props.mobileOpen ? '0' : '-100%'});
    width: 250px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
`;

const Logo = styled.div`
  font-size: ${props => props.collapsed ? '1.25rem' : '1.5rem'};
  font-weight: bold;
  color: ${props => props.theme.primary};
`;

const CollapseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.text};
  cursor: pointer;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: ${props => props.theme.primary};
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  justify-content: ${props => props.collapsed ? 'center' : 'flex-start'};
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.theme.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.25rem;
  margin-right: ${props => props.collapsed ? '0' : '1rem'};
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.div`
  font-weight: 500;
`;

const UserRole = styled.div`
  font-size: 0.8rem;
  opacity: 0.7;
`;

const MenuContainer = styled.nav`
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
`;

const MenuItem = styled.div`
  margin: 0.25rem 0;
  padding: 0 ${props => props.collapsed ? '0.5rem' : '1rem'};
  
  ${props => props.active && `
    background-color: ${props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
    border-left: 3px solid ${props.theme.primary};
  `}
`;

const MenuLink = styled.a`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  color: ${props => props.theme.text};
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
    color: ${props => props.theme.primary};
  }
`;

const MenuIcon = styled.div`
  font-size: 1.25rem;
  min-width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MenuLabel = styled.div`
  margin-left: 0.5rem;
`;

const SidebarFooter = styled.div`
  padding: 1rem;
  border-top: 1px solid ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  display: flex;
  justify-content: ${props => props.collapsed ? 'center' : 'flex-start'};
`;

const FooterLink = styled.a`
  display: flex;
  align-items: center;
  color: ${props => props.theme.text};
  text-decoration: none;
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
    color: ${props => props.theme.primary};
  }
  
  span {
    margin-left: 0.5rem;
  }
`;

const MobileToggle = styled.button`
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 101;
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 4px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
  
  @media (min-width: 769px) {
    display: none;
  }
`;

export default AdminSidebar;