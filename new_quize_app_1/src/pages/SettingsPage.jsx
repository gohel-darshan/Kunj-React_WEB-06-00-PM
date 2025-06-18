import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaCog, FaMoon, FaSun, FaVolumeUp, FaVolumeMute, FaTrash, FaUserEdit, FaSave } from 'react-icons/fa';
import Card, { CardHeader, CardTitle, CardBody, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useQuiz } from '../contexts/QuizContext';
import { useTheme } from '../contexts/ThemeContext';
import { toast } from 'react-toastify';
import { getUserSettings, saveUserSettings, clearLocalStorage } from '../utils/storage';

const SettingsPage = () => {
  const { username, setUsername, updateQuizSettings, quizSettings } = useQuiz();
  const { darkMode, toggleDarkMode, themeColors, updateThemeColors } = useTheme();
  
  const [settings, setSettings] = useState({
    sound: true,
    notifications: true,
    shuffleQuestions: true,
    timeLimit: 30,
    numberOfQuestions: 10,
  });
  
  const [newUsername, setNewUsername] = useState(username);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = getUserSettings();
    setSettings({
      ...settings,
      ...savedSettings,
      shuffleQuestions: quizSettings.shuffleQuestions,
      timeLimit: quizSettings.timeLimit,
      numberOfQuestions: quizSettings.numberOfQuestions,
    });
  }, [quizSettings]);

  const handleSettingChange = (setting, value) => {
    setSettings({
      ...settings,
      [setting]: value,
    });
  };

  const handleSaveSettings = () => {
    // Save settings to localStorage
    saveUserSettings(settings);
    
    // Update quiz settings
    updateQuizSettings({
      shuffleQuestions: settings.shuffleQuestions,
      timeLimit: settings.timeLimit,
      numberOfQuestions: settings.numberOfQuestions,
    });
    
    // Update username if changed
    if (newUsername !== username && newUsername.trim()) {
      setUsername(newUsername);
    }
    
    toast.success('Settings saved successfully!');
  };

  const handleResetAll = () => {
    setShowConfirmReset(true);
  };

  const confirmReset = () => {
    // Clear all localStorage data
    clearLocalStorage();
    
    // Reset settings to defaults
    setSettings({
      sound: true,
      notifications: true,
      shuffleQuestions: true,
      timeLimit: 30,
      numberOfQuestions: 10,
    });
    
    // Reset username
    setNewUsername('');
    setUsername('');
    
    setShowConfirmReset(false);
    toast.success('All data has been reset to defaults');
  };

  const cancelReset = () => {
    setShowConfirmReset(false);
  };

  return (
    <SettingsContainer>
      <PageHeader>
        <Title>Settings</Title>
        <Subtitle>Customize your quiz experience</Subtitle>
      </PageHeader>

      <SettingsGrid>
        <SettingsCard>
          <CardHeader>
            <SettingsIcon>
              <FaUserEdit />
            </SettingsIcon>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardBody>
            <SettingGroup>
              <SettingLabel>Username</SettingLabel>
              <SettingControl>
                <SettingInput 
                  type="text" 
                  value={newUsername || ''} 
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Enter your username"
                  maxLength={20}
                />
              </SettingControl>
            </SettingGroup>
          </CardBody>
        </SettingsCard>

        <SettingsCard>
          <CardHeader>
            <SettingsIcon>
              <FaCog />
            </SettingsIcon>
            <CardTitle>Quiz Settings</CardTitle>
          </CardHeader>
          <CardBody>
            <SettingGroup>
              <SettingLabel>Shuffle Questions</SettingLabel>
              <SettingControl>
                <ToggleSwitch 
                  checked={settings.shuffleQuestions} 
                  onChange={() => handleSettingChange('shuffleQuestions', !settings.shuffleQuestions)}
                />
              </SettingControl>
            </SettingGroup>
            
            <SettingGroup>
              <SettingLabel>Time Limit (seconds per question)</SettingLabel>
              <SettingControl>
                <RangeSlider 
                  type="range" 
                  min={10} 
                  max={120} 
                  step={5}
                  value={settings.timeLimit} 
                  onChange={(e) => handleSettingChange('timeLimit', parseInt(e.target.value))}
                />
                <RangeValue>{settings.timeLimit} seconds</RangeValue>
              </SettingControl>
            </SettingGroup>
            
            <SettingGroup>
              <SettingLabel>Number of Questions</SettingLabel>
              <SettingControl>
                <RangeSlider 
                  type="range" 
                  min={5} 
                  max={20} 
                  step={1}
                  value={settings.numberOfQuestions} 
                  onChange={(e) => handleSettingChange('numberOfQuestions', parseInt(e.target.value))}
                />
                <RangeValue>{settings.numberOfQuestions} questions</RangeValue>
              </SettingControl>
            </SettingGroup>
          </CardBody>
        </SettingsCard>

        <SettingsCard>
          <CardHeader>
            <SettingsIcon>
              {darkMode ? <FaMoon /> : <FaSun />}
            </SettingsIcon>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardBody>
            <SettingGroup>
              <SettingLabel>Dark Mode</SettingLabel>
              <SettingControl>
                <ToggleSwitch 
                  checked={darkMode} 
                  onChange={toggleDarkMode}
                />
              </SettingControl>
            </SettingGroup>
          </CardBody>
        </SettingsCard>

        <SettingsCard>
          <CardHeader>
            <SettingsIcon>
              {settings.sound ? <FaVolumeUp /> : <FaVolumeMute />}
            </SettingsIcon>
            <CardTitle>Sound & Notifications</CardTitle>
          </CardHeader>
          <CardBody>
            <SettingGroup>
              <SettingLabel>Sound Effects</SettingLabel>
              <SettingControl>
                <ToggleSwitch 
                  checked={settings.sound} 
                  onChange={() => handleSettingChange('sound', !settings.sound)}
                />
              </SettingControl>
            </SettingGroup>
            
            <SettingGroup>
              <SettingLabel>Notifications</SettingLabel>
              <SettingControl>
                <ToggleSwitch 
                  checked={settings.notifications} 
                  onChange={() => handleSettingChange('notifications', !settings.notifications)}
                />
              </SettingControl>
            </SettingGroup>
          </CardBody>
        </SettingsCard>
      </SettingsGrid>

      <ActionsContainer>
        <Button 
          variant="primary" 
          icon={<FaSave />}
          onClick={handleSaveSettings}
        >
          Save Settings
        </Button>
        <Button 
          variant="danger" 
          icon={<FaTrash />}
          onClick={handleResetAll}
        >
          Reset All Data
        </Button>
      </ActionsContainer>

      {showConfirmReset && (
        <ConfirmationOverlay>
          <ConfirmationDialog>
            <ConfirmationTitle>Reset All Data?</ConfirmationTitle>
            <ConfirmationMessage>
              This will delete all your saved progress, scores, and settings.
              This action cannot be undone.
            </ConfirmationMessage>
            <ConfirmationButtons>
              <Button variant="outline" onClick={cancelReset}>
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmReset}>
                Reset Everything
              </Button>
            </ConfirmationButtons>
          </ConfirmationDialog>
        </ConfirmationOverlay>
      )}
    </SettingsContainer>
  );
};

const SettingsContainer = styled.div`
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

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const SettingsCard = styled(Card)`
  height: 100%;
`;

const SettingsIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  background-color: ${props => props.theme.primary};
  color: white;
`;

const SettingGroup = styled.div`
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SettingLabel = styled.div`
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const SettingControl = styled.div`
  display: flex;
  align-items: center;
`;

const SettingInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  border: 2px solid ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
  color: ${props => props.theme.text};
  font-size: 1rem;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const ToggleSwitch = ({ checked, onChange }) => (
  <ToggleSwitchContainer onClick={onChange}>
    <ToggleSwitchInput type="checkbox" checked={checked} onChange={() => {}} />
    <ToggleSwitchSlider checked={checked} />
  </ToggleSwitchContainer>
);

const ToggleSwitchContainer = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  cursor: pointer;
`;

const ToggleSwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

const ToggleSwitchSlider = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.checked ? props.theme.primary : props.theme.isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
  transition: 0.4s;
  border-radius: 34px;
  
  &:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
    transform: ${props => props.checked ? 'translateX(26px)' : 'translateX(0)'};
  }
`;

const RangeSlider = styled.input`
  -webkit-appearance: none;
  width: 100%;
  height: 8px;
  border-radius: 5px;
  background: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${props => props.theme.primary};
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${props => props.theme.primary};
    cursor: pointer;
    border: none;
  }
`;

const RangeValue = styled.div`
  margin-left: 1rem;
  min-width: 100px;
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    
    button {
      width: 100%;
    }
  }
`;

const ConfirmationOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ConfirmationDialog = styled.div`
  background-color: ${props => props.theme.surface};
  border-radius: 8px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const ConfirmationTitle = styled.h3`
  margin: 0 0 1rem;
  font-size: 1.5rem;
  color: ${props => props.theme.error};
`;

const ConfirmationMessage = styled.p`
  margin: 0 0 1.5rem;
  line-height: 1.5;
  color: ${props => props.theme.text};
`;

const ConfirmationButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    
    button {
      width: 100%;
    }
  }
`;

export default SettingsPage;