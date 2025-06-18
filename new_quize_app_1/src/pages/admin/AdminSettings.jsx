import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaSave, FaUndo, FaDatabase, FaServer, FaEnvelope, FaLock, FaGlobe, FaCloudUploadAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import Card, { CardHeader, CardTitle, CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { getFromLocalStorage, saveToLocalStorage } from '../../utils/storage';
import { logAdminActivity } from '../../utils/adminAuth';
import { useQuiz } from '../../contexts/QuizContext';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    general: {
      siteName: 'QuizMaster',
      siteDescription: 'Test your knowledge with fun and challenging quizzes!',
      logoUrl: '/logo.png',
      faviconUrl: '/favicon.ico',
      allowRegistration: true,
      requireEmailVerification: false,
      defaultUserRole: 'user'
    },
    quiz: {
      defaultTimePerQuestion: 30,
      defaultQuestionsPerQuiz: 10,
      allowGuestQuizzes: true,
      showCorrectAnswers: true,
      shuffleQuestions: true,
      shuffleAnswers: true,
      passingScore: 60
    },
    email: {
      smtpServer: 'smtp.example.com',
      smtpPort: 587,
      smtpUsername: 'notifications@quizmaster.com',
      smtpPassword: '********',
      fromEmail: 'notifications@quizmaster.com',
      fromName: 'QuizMaster'
    },
    security: {
      sessionTimeout: 60,
      maxLoginAttempts: 5,
      lockoutDuration: 30,
      passwordMinLength: 8,
      passwordRequireUppercase: true,
      passwordRequireNumbers: true,
      passwordRequireSymbols: false
    },
    advanced: {
      cacheLifetime: 60,
      maxUploadSize: 5,
      allowedFileTypes: 'jpg,jpeg,png,gif,pdf',
      maintenanceMode: false,
      debugMode: false
    }
  });
  
  const [originalSettings, setOriginalSettings] = useState({});
  const [activeTab, setActiveTab] = useState('general');
  
  const navigate = useNavigate();
  const { username } = useQuiz();
  
  useEffect(() => {
    // Load settings from storage
    const storedSettings = getFromLocalStorage('adminSettings', null);
    
    if (storedSettings) {
      setSettings(storedSettings);
      setOriginalSettings(storedSettings);
    } else {
      // If no settings exist, use the default settings
      setOriginalSettings(settings);
    }
    
    // Log admin activity
    logAdminActivity(username, 'view_settings');
  }, [username]);
  
  const handleChange = (section, field, value) => {
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [field]: value
      }
    });
  };
  
  const handleSave = () => {
    // Save settings to storage
    saveToLocalStorage('adminSettings', settings);
    setOriginalSettings(settings);
    
    // Log admin activity
    logAdminActivity(username, 'update_settings', {
      sections: Object.keys(settings).filter(section => 
        JSON.stringify(settings[section]) !== JSON.stringify(originalSettings[section])
      )
    });
    
    toast.success('Settings saved successfully');
  };
  
  const handleReset = () => {
    // Reset to original settings
    setSettings(originalSettings);
    toast.info('Settings reset to last saved state');
  };
  
  const renderGeneralSettings = () => (
    <>
      <FormGroup>
        <FormLabel>Site Name</FormLabel>
        <FormInput
          type="text"
          value={settings.general.siteName}
          onChange={(e) => handleChange('general', 'siteName', e.target.value)}
        />
      </FormGroup>
      
      <FormGroup>
        <FormLabel>Site Description</FormLabel>
        <FormTextarea
          value={settings.general.siteDescription}
          onChange={(e) => handleChange('general', 'siteDescription', e.target.value)}
          rows={3}
        />
      </FormGroup>
      
      <FormRow>
        <FormGroup>
          <FormLabel>Logo URL</FormLabel>
          <FormInput
            type="text"
            value={settings.general.logoUrl}
            onChange={(e) => handleChange('general', 'logoUrl', e.target.value)}
          />
        </FormGroup>
        
        <FormGroup>
          <FormLabel>Favicon URL</FormLabel>
          <FormInput
            type="text"
            value={settings.general.faviconUrl}
            onChange={(e) => handleChange('general', 'faviconUrl', e.target.value)}
          />
        </FormGroup>
      </FormRow>
      
      <FormGroup>
        <FormCheckboxLabel>
          <FormCheckbox
            type="checkbox"
            checked={settings.general.allowRegistration}
            onChange={(e) => handleChange('general', 'allowRegistration', e.target.checked)}
          />
          Allow User Registration
        </FormCheckboxLabel>
      </FormGroup>
      
      <FormGroup>
        <FormCheckboxLabel>
          <FormCheckbox
            type="checkbox"
            checked={settings.general.requireEmailVerification}
            onChange={(e) => handleChange('general', 'requireEmailVerification', e.target.checked)}
          />
          Require Email Verification
        </FormCheckboxLabel>
      </FormGroup>
      
      <FormGroup>
        <FormLabel>Default User Role</FormLabel>
        <FormSelect
          value={settings.general.defaultUserRole}
          onChange={(e) => handleChange('general', 'defaultUserRole', e.target.value)}
        >
          <option value="user">User</option>
          <option value="moderator">Moderator</option>
          <option value="admin">Admin</option>
        </FormSelect>
      </FormGroup>
    </>
  );
  
  const renderQuizSettings = () => (
    <>
      <FormRow>
        <FormGroup>
          <FormLabel>Default Time Per Question (seconds)</FormLabel>
          <FormInput
            type="number"
            min="5"
            max="300"
            value={settings.quiz.defaultTimePerQuestion}
            onChange={(e) => handleChange('quiz', 'defaultTimePerQuestion', parseInt(e.target.value))}
          />
        </FormGroup>
        
        <FormGroup>
          <FormLabel>Default Questions Per Quiz</FormLabel>
          <FormInput
            type="number"
            min="1"
            max="50"
            value={settings.quiz.defaultQuestionsPerQuiz}
            onChange={(e) => handleChange('quiz', 'defaultQuestionsPerQuiz', parseInt(e.target.value))}
          />
        </FormGroup>
      </FormRow>
      
      <FormGroup>
        <FormLabel>Passing Score (%)</FormLabel>
        <FormInput
          type="number"
          min="0"
          max="100"
          value={settings.quiz.passingScore}
          onChange={(e) => handleChange('quiz', 'passingScore', parseInt(e.target.value))}
        />
      </FormGroup>
      
      <FormGroup>
        <FormCheckboxLabel>
          <FormCheckbox
            type="checkbox"
            checked={settings.quiz.allowGuestQuizzes}
            onChange={(e) => handleChange('quiz', 'allowGuestQuizzes', e.target.checked)}
          />
          Allow Guest Quizzes
        </FormCheckboxLabel>
      </FormGroup>
      
      <FormGroup>
        <FormCheckboxLabel>
          <FormCheckbox
            type="checkbox"
            checked={settings.quiz.showCorrectAnswers}
            onChange={(e) => handleChange('quiz', 'showCorrectAnswers', e.target.checked)}
          />
          Show Correct Answers After Quiz
        </FormCheckboxLabel>
      </FormGroup>
      
      <FormGroup>
        <FormCheckboxLabel>
          <FormCheckbox
            type="checkbox"
            checked={settings.quiz.shuffleQuestions}
            onChange={(e) => handleChange('quiz', 'shuffleQuestions', e.target.checked)}
          />
          Shuffle Questions
        </FormCheckboxLabel>
      </FormGroup>
      
      <FormGroup>
        <FormCheckboxLabel>
          <FormCheckbox
            type="checkbox"
            checked={settings.quiz.shuffleAnswers}
            onChange={(e) => handleChange('quiz', 'shuffleAnswers', e.target.checked)}
          />
          Shuffle Answers
        </FormCheckboxLabel>
      </FormGroup>
    </>
  );
  
  const renderEmailSettings = () => (
    <>
      <FormRow>
        <FormGroup>
          <FormLabel>SMTP Server</FormLabel>
          <FormInput
            type="text"
            value={settings.email.smtpServer}
            onChange={(e) => handleChange('email', 'smtpServer', e.target.value)}
          />
        </FormGroup>
        
        <FormGroup>
          <FormLabel>SMTP Port</FormLabel>
          <FormInput
            type="number"
            value={settings.email.smtpPort}
            onChange={(e) => handleChange('email', 'smtpPort', parseInt(e.target.value))}
          />
        </FormGroup>
      </FormRow>
      
      <FormRow>
        <FormGroup>
          <FormLabel>SMTP Username</FormLabel>
          <FormInput
            type="text"
            value={settings.email.smtpUsername}
            onChange={(e) => handleChange('email', 'smtpUsername', e.target.value)}
          />
        </FormGroup>
        
        <FormGroup>
          <FormLabel>SMTP Password</FormLabel>
          <FormInput
            type="password"
            value={settings.email.smtpPassword}
            onChange={(e) => handleChange('email', 'smtpPassword', e.target.value)}
          />
        </FormGroup>
      </FormRow>
      
      <FormRow>
        <FormGroup>
          <FormLabel>From Email</FormLabel>
          <FormInput
            type="email"
            value={settings.email.fromEmail}
            onChange={(e) => handleChange('email', 'fromEmail', e.target.value)}
          />
        </FormGroup>
        
        <FormGroup>
          <FormLabel>From Name</FormLabel>
          <FormInput
            type="text"
            value={settings.email.fromName}
            onChange={(e) => handleChange('email', 'fromName', e.target.value)}
          />
        </FormGroup>
      </FormRow>
      
      <FormActions>
        <Button variant="secondary">Test Email Configuration</Button>
      </FormActions>
    </>
  );
  
  const renderSecuritySettings = () => (
    <>
      <FormRow>
        <FormGroup>
          <FormLabel>Session Timeout (minutes)</FormLabel>
          <FormInput
            type="number"
            min="5"
            value={settings.security.sessionTimeout}
            onChange={(e) => handleChange('security', 'sessionTimeout', parseInt(e.target.value))}
          />
        </FormGroup>
        
        <FormGroup>
          <FormLabel>Max Login Attempts</FormLabel>
          <FormInput
            type="number"
            min="1"
            value={settings.security.maxLoginAttempts}
            onChange={(e) => handleChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
          />
        </FormGroup>
      </FormRow>
      
      <FormGroup>
        <FormLabel>Lockout Duration (minutes)</FormLabel>
        <FormInput
          type="number"
          min="1"
          value={settings.security.lockoutDuration}
          onChange={(e) => handleChange('security', 'lockoutDuration', parseInt(e.target.value))}
        />
      </FormGroup>
      
      <FormGroup>
        <FormLabel>Password Minimum Length</FormLabel>
        <FormInput
          type="number"
          min="6"
          value={settings.security.passwordMinLength}
          onChange={(e) => handleChange('security', 'passwordMinLength', parseInt(e.target.value))}
        />
      </FormGroup>
      
      <FormGroup>
        <FormCheckboxLabel>
          <FormCheckbox
            type="checkbox"
            checked={settings.security.passwordRequireUppercase}
            onChange={(e) => handleChange('security', 'passwordRequireUppercase', e.target.checked)}
          />
          Require Uppercase Letters in Password
        </FormCheckboxLabel>
      </FormGroup>
      
      <FormGroup>
        <FormCheckboxLabel>
          <FormCheckbox
            type="checkbox"
            checked={settings.security.passwordRequireNumbers}
            onChange={(e) => handleChange('security', 'passwordRequireNumbers', e.target.checked)}
          />
          Require Numbers in Password
        </FormCheckboxLabel>
      </FormGroup>
      
      <FormGroup>
        <FormCheckboxLabel>
          <FormCheckbox
            type="checkbox"
            checked={settings.security.passwordRequireSymbols}
            onChange={(e) => handleChange('security', 'passwordRequireSymbols', e.target.checked)}
          />
          Require Symbols in Password
        </FormCheckboxLabel>
      </FormGroup>
    </>
  );
  
  const renderAdvancedSettings = () => (
    <>
      <FormRow>
        <FormGroup>
          <FormLabel>Cache Lifetime (minutes)</FormLabel>
          <FormInput
            type="number"
            min="0"
            value={settings.advanced.cacheLifetime}
            onChange={(e) => handleChange('advanced', 'cacheLifetime', parseInt(e.target.value))}
          />
        </FormGroup>
        
        <FormGroup>
          <FormLabel>Max Upload Size (MB)</FormLabel>
          <FormInput
            type="number"
            min="1"
            value={settings.advanced.maxUploadSize}
            onChange={(e) => handleChange('advanced', 'maxUploadSize', parseInt(e.target.value))}
          />
        </FormGroup>
      </FormRow>
      
      <FormGroup>
        <FormLabel>Allowed File Types (comma separated)</FormLabel>
        <FormInput
          type="text"
          value={settings.advanced.allowedFileTypes}
          onChange={(e) => handleChange('advanced', 'allowedFileTypes', e.target.value)}
        />
      </FormGroup>
      
      <FormGroup>
        <FormCheckboxLabel>
          <FormCheckbox
            type="checkbox"
            checked={settings.advanced.maintenanceMode}
            onChange={(e) => handleChange('advanced', 'maintenanceMode', e.target.checked)}
          />
          Maintenance Mode
        </FormCheckboxLabel>
      </FormGroup>
      
      <FormGroup>
        <FormCheckboxLabel>
          <FormCheckbox
            type="checkbox"
            checked={settings.advanced.debugMode}
            onChange={(e) => handleChange('advanced', 'debugMode', e.target.checked)}
          />
          Debug Mode
        </FormCheckboxLabel>
      </FormGroup>
      
      <FormActions>
        <Button variant="secondary">Clear Cache</Button>
        <Button variant="secondary">Export Database</Button>
      </FormActions>
    </>
  );
  
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'quiz':
        return renderQuizSettings();
      case 'email':
        return renderEmailSettings();
      case 'security':
        return renderSecuritySettings();
      case 'advanced':
        return renderAdvancedSettings();
      default:
        return renderGeneralSettings();
    }
  };
  
  return (
    <AdminLayout>
      <AdminSidebar />
      <MainContent>
        <AdminHeader title="System Settings" />
        
        <SettingsContainer>
          <SettingsTabs>
            <SettingsTab 
              active={activeTab === 'general'} 
              onClick={() => setActiveTab('general')}
            >
              <FaGlobe /> General
            </SettingsTab>
            <SettingsTab 
              active={activeTab === 'quiz'} 
              onClick={() => setActiveTab('quiz')}
            >
              <FaDatabase /> Quiz
            </SettingsTab>
            <SettingsTab 
              active={activeTab === 'email'} 
              onClick={() => setActiveTab('email')}
            >
              <FaEnvelope /> Email
            </SettingsTab>
            <SettingsTab 
              active={activeTab === 'security'} 
              onClick={() => setActiveTab('security')}
            >
              <FaLock /> Security
            </SettingsTab>
            <SettingsTab 
              active={activeTab === 'advanced'} 
              onClick={() => setActiveTab('advanced')}
            >
              <FaServer /> Advanced
            </SettingsTab>
          </SettingsTabs>
          
          <SettingsContent>
            <Card>
              <CardHeader>
                <CardTitle>
                  {activeTab === 'general' && 'General Settings'}
                  {activeTab === 'quiz' && 'Quiz Settings'}
                  {activeTab === 'email' && 'Email Settings'}
                  {activeTab === 'security' && 'Security Settings'}
                  {activeTab === 'advanced' && 'Advanced Settings'}
                </CardTitle>
              </CardHeader>
              <CardBody>
                {renderActiveTabContent()}
              </CardBody>
            </Card>
            
            <SettingsActions>
              <Button 
                variant="secondary" 
                onClick={handleReset}
                icon={<FaUndo />}
              >
                Reset Changes
              </Button>
              <Button 
                variant="primary" 
                onClick={handleSave}
                icon={<FaSave />}
              >
                Save Settings
              </Button>
            </SettingsActions>
          </SettingsContent>
        </SettingsContainer>
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

const SettingsContainer = styled.div`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SettingsTabs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 200px;
  
  @media (max-width: 768px) {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
  }
`;

const SettingsTab = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background-color: ${props => props.active ? props.theme.primary : props.theme.surface};
  color: ${props => props.active ? 'white' : props.theme.text};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  text-align: left;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.active ? props.theme.primary : props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  }
  
  @media (max-width: 768px) {
    flex: 1;
    min-width: 120px;
    justify-content: center;
  }
`;

const SettingsContent = styled.div`
  flex: 1;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 4px;
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
  color: ${props => props.theme.text};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 4px;
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
  color: ${props => props.theme.text};
  font-size: 1rem;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 4px;
  background-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
  color: ${props => props.theme.text};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const FormCheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`;

const FormCheckbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SettingsActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

export default AdminSettings;