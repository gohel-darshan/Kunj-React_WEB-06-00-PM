import { useState } from 'react';
import { login, socialLogin } from '../../services/auth';
import './LoginForm.css';

const LoginForm = ({ onLogin, switchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const user = await login(email, password);
      onLogin(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setError('');
    setLoading(true);
    
    try {
      const user = await socialLogin(provider);
      onLogin(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form login-form">
      <h2>Login to Your Account</h2>
      
      {error && <div className="auth-error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
      
      <div className="social-login">
        <p>Or login with:</p>
        <div className="social-buttons">
          <button
            type="button"
            className="btn btn-social btn-google"
            onClick={() => handleSocialLogin('google')}
            disabled={loading}
          >
            Google
          </button>
          <button
            type="button"
            className="btn btn-social btn-facebook"
            onClick={() => handleSocialLogin('facebook')}
            disabled={loading}
          >
            Facebook
          </button>
        </div>
      </div>
      
      <div className="auth-switch">
        <p>Don't have an account?</p>
        <button type="button" className="btn-link" onClick={switchToRegister}>
          Register Now
        </button>
      </div>
    </div>
  );
};

export default LoginForm;