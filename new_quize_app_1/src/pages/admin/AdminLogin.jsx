import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaLock, FaUser, FaShieldAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getFromLocalStorage } from '../../utils/storage';
import { isAdmin } from '../../utils/adminAuth';
import { useQuiz } from '../../contexts/QuizContext';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUsername: setLoggedInUser } = useQuiz();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate inputs
    if (!username || !password) {
      toast.error('Please enter both username and password');
      setLoading(false);
      return;
    }

    // Get users from storage
    const users = getFromLocalStorage('users', []);
    const user = users.find(u => u.username === username);

    // Check if user exists and is admin
    if (!user) {
      toast.error('Invalid username or password');
      setLoading(false);
      return;
    }

    // In a real app, you would hash and properly compare passwords
    // This is a simplified version for demonstration
    if (password !== 'admin123') {
      toast.error('Invalid username or password');
      setLoading(false);
      return;
    }

    // Check if user is admin
    if (!isAdmin(username)) {
      toast.error('You do not have admin privileges');
      setLoading(false);
      return;
    }

    // Set logged in user in context
    setLoggedInUser(username);

    // Simulate loading
    setTimeout(() => {
      setLoading(false);
      toast.success('Login successful');
      navigate('/admin');
    }, 1000);
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LoginHeader>
          <LogoIcon>
            <FaShieldAlt />
          </LogoIcon>
          <LoginTitle>Admin Login</LoginTitle>
        </LoginHeader>

        <LoginForm onSubmit={handleSubmit}>
          <FormGroup>
            <InputIcon>
              <FaUser />
            </InputIcon>
            <FormInput
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </FormGroup>

          <FormGroup>
            <InputIcon>
              <FaLock />
            </InputIcon>
            <FormInput
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </FormGroup>

          <LoginButton type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </LoginButton>
        </LoginForm>

        <LoginFooter>
          <BackLink onClick={() => navigate('/')}>
            Return to Quiz App
          </BackLink>
        </LoginFooter>
      </LoginCard>
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: ${props => props.theme.isDark ? '#121212' : '#f5f7fa'};
  padding: 1rem;
`;

const LoginCard = styled.div`
  width: 100%;
  max-width: 400px;
  background-color: ${props => props.theme.surface};
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const LoginHeader = styled.div`
  padding: 2rem;
  background-color: ${props => props.theme.primary};
  color: white;
  text-align: center;
`;

const LogoIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const LoginTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
`;

const LoginForm = styled.form`
  padding: 2rem;
`;

const FormGroup = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

const InputIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'};
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 4px;
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
  color: ${props => props.theme.text};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.primaryDark || props.theme.primary};
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const LoginFooter = styled.div`
  padding: 1rem 2rem 2rem;
  text-align: center;
`;

const BackLink = styled.a`
  color: ${props => props.theme.primary};
  text-decoration: none;
  font-size: 0.9rem;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

export default AdminLogin;