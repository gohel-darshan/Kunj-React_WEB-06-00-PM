import { useState, useEffect } from 'react';
import { getCurrentUser, updateProfile, logout } from '../../services/auth';
import './UserProfile.css';
import AddressBook from './AddressBook';
import OrderHistory from './OrderHistory';
import AccountSettings from './AccountSettings';
import LoyaltyPoints from './LoyaltyPoints';

const UserProfile = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user data
    const userData = getCurrentUser();
    setUser(userData);
    setLoading(false);
  }, []);

  const handleUpdateProfile = async (updates) => {
    try {
      const updatedUser = await updateProfile(updates);
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const handleLogout = () => {
    logout();
    onLogout();
  };

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  if (!user) {
    return <div className="profile-error">Please log in to view your profile</div>;
  }

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="profile-tabs">
        <button 
          className={`tab-button ${activeTab === 'account' ? 'active' : ''}`}
          onClick={() => setActiveTab('account')}
        >
          Account Settings
        </button>
        <button 
          className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Order History
        </button>
        <button 
          className={`tab-button ${activeTab === 'addresses' ? 'active' : ''}`}
          onClick={() => setActiveTab('addresses')}
        >
          Address Book
        </button>
        <button 
          className={`tab-button ${activeTab === 'loyalty' ? 'active' : ''}`}
          onClick={() => setActiveTab('loyalty')}
        >
          Loyalty Points
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'account' && (
          <AccountSettings 
            user={user} 
            onUpdate={handleUpdateProfile} 
            onLogout={handleLogout}
          />
        )}
        
        {activeTab === 'orders' && (
          <OrderHistory user={user} />
        )}
        
        {activeTab === 'addresses' && (
          <AddressBook 
            addresses={user.addresses || []} 
            onUpdate={handleUpdateProfile}
          />
        )}
        
        {activeTab === 'loyalty' && (
          <LoyaltyPoints user={user} />
        )}
      </div>
    </div>
  );
};

export default UserProfile;