import { useState } from 'react';
import styled from 'styled-components';
import { FaBell, FaEnvelope, FaSearch, FaSignOutAlt, FaUser, FaCog } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../../contexts/QuizContext';
import { useTheme } from '../../contexts/ThemeContext';

const AdminHeader = ({ title }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { username } = useQuiz();
  const { darkMode, toggleDarkMode } = useTheme();
  
  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };
  
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  
  const handleLogout = () => {
    // Implement logout functionality
    navigate('/');
  };
  
  return (
    <HeaderContainer>
      <PageTitle>{title}</PageTitle>
      
      <SearchForm onSubmit={handleSearch}>
        <SearchInput
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <SearchButton type="submit">
          <FaSearch />
        </SearchButton>
      </SearchForm>
      
      <HeaderActions>
        <ActionButton>
          <FaBell />
          <NotificationBadge>3</NotificationBadge>
        </ActionButton>
        
        <ActionButton>
          <FaEnvelope />
          <NotificationBadge>5</NotificationBadge>
        </ActionButton>
        
        <UserDropdown>
          <UserButton onClick={toggleDropdown}>
            <UserAvatar>
              {username.charAt(0).toUpperCase()}
            </UserAvatar>
          </UserButton>
          
          {showDropdown && (
            <DropdownMenu>
              <DropdownHeader>
                <UserName>{username}</UserName>
                <UserRole>Administrator</UserRole>
              </DropdownHeader>
              
              <DropdownItem onClick={() => navigate('/admin/profile')}>
                <FaUser />
                <span>Profile</span>
              </DropdownItem>
              
              <DropdownItem onClick={() => navigate('/admin/settings')}>
                <FaCog />
                <span>Settings</span>
              </DropdownItem>
              
              <DropdownItem onClick={toggleDarkMode}>
                <FaCog />
                <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </DropdownItem>
              
              <DropdownDivider />
              
              <DropdownItem onClick={handleLogout}>
                <FaSignOutAlt />
                <span>Logout</span>
              </DropdownItem>
            </DropdownMenu>
          )}
        </UserDropdown>
      </HeaderActions>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: 1.75rem;
  font-weight: 600;
  color: ${props => props.theme.primary};
  
  @media (max-width: 768px) {
    margin-top: 3rem;
  }
`;

const SearchForm = styled.form`
  display: flex;
  align-items: center;
  flex: 1;
  max-width: 400px;
  margin: 0 2rem;
  
  @media (max-width: 768px) {
    margin: 0;
    max-width: 100%;
    width: 100%;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 4px 0 0 4px;
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
  color: ${props => props.theme.text};
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const SearchButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.theme.isDark ? props.theme.primary : '#3a80d2'};
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const ActionButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
  border: 1px solid ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  color: ${props => props.theme.text};
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
    color: ${props => props.theme.primary};
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${props => props.theme.error};
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
`;

const UserDropdown = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
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
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 220px;
  background-color: ${props => props.theme.surface};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 100;
  
  @media (max-width: 768px) {
    width: 200px;
  }
`;

const DropdownHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
`;

const UserName = styled.div`
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const UserRole = styled.div`
  font-size: 0.8rem;
  opacity: 0.7;
`;

const DropdownItem = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: ${props => props.theme.text};
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  
  svg {
    margin-right: 0.75rem;
    font-size: 1rem;
  }
  
  &:hover {
    background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
    color: ${props => props.theme.primary};
  }
`;

const DropdownDivider = styled.div`
  height: 1px;
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  margin: 0.5rem 0;
`;

export default AdminHeader;