import styled, { ThemeProvider } from 'styled-components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './Header';
import Footer from './Footer';
import InstallPrompt from '../pwa/InstallPrompt';
import OfflineIndicator from '../pwa/OfflineIndicator';
import { useTheme } from '../../contexts/ThemeContext';

const Layout = ({ children }) => {
  const { darkMode, themeColors } = useTheme();
  
  // Create theme object for styled-components
  const theme = {
    ...themeColors,
    isDark: darkMode,
  };

  return (
    <ThemeProvider theme={theme}>
      <LayoutContainer>
        <OfflineIndicator />
        <Header />
        <Main>{children}</Main>
        <Footer />
        <InstallPrompt />
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={darkMode ? 'dark' : 'light'}
        />
      </LayoutContainer>
    </ThemeProvider>
  );
};

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const Main = styled.main`
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

export default Layout;