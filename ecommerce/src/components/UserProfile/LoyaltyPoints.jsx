import { useState } from 'react';
import './LoyaltyPoints.css';

// Mock rewards data
const mockRewards = [
  {
    id: 1,
    name: '$5 Off Coupon',
    pointsCost: 500,
    description: 'Get $5 off your next purchase',
    expiresIn: '30 days after redemption'
  },
  {
    id: 2,
    name: '$10 Off Coupon',
    pointsCost: 1000,
    description: 'Get $10 off your next purchase',
    expiresIn: '30 days after redemption'
  },
  {
    id: 3,
    name: 'Free Standard Shipping',
    pointsCost: 750,
    description: 'Get free standard shipping on any order',
    expiresIn: '60 days after redemption'
  },
  {
    id: 4,
    name: '15% Off Coupon',
    pointsCost: 1500,
    description: 'Get 15% off your next purchase',
    expiresIn: '30 days after redemption'
  },
  {
    id: 5,
    name: 'Free Gift with Purchase',
    pointsCost: 2000,
    description: 'Receive a free gift with your next order',
    expiresIn: '60 days after redemption'
  }
];

// Mock point history
const mockPointHistory = [
  {
    id: 1,
    date: '2023-06-15T14:30:00Z',
    points: 120,
    type: 'earned',
    description: 'Purchase: Order #ORD-12345'
  },
  {
    id: 2,
    date: '2023-05-20T10:15:00Z',
    points: 500,
    type: 'spent',
    description: 'Reward: $5 Off Coupon'
  },
  {
    id: 3,
    date: '2023-04-02T16:45:00Z',
    points: 50,
    type: 'earned',
    description: 'Purchase: Order #ORD-67890'
  },
  {
    id: 4,
    date: '2023-03-15T09:30:00Z',
    points: 100,
    type: 'earned',
    description: 'Account Creation Bonus'
  }
];

const PointsOverview = ({ points }) => {
  return (
    <div className="points-overview">
      <div className="points-card">
        <div className="points-value">{points}</div>
        <div className="points-label">Available Points</div>
      </div>
      
      <div className="points-info">
        <h4>How It Works</h4>
        <ul>
          <li>Earn 10 points for every $1 spent</li>
          <li>Earn bonus points on special promotions</li>
          <li>Redeem points for rewards and discounts</li>
          <li>Points expire 12 months after they are earned</li>
        </ul>
      </div>
    </div>
  );
};

const RewardCard = ({ reward, userPoints, onRedeem }) => {
  const canRedeem = userPoints >= reward.pointsCost;
  
  return (
    <div className={`reward-card ${!canRedeem ? 'disabled' : ''}`}>
      <div className="reward-name">{reward.name}</div>
      <div className="reward-cost">
        <span className="cost-value">{reward.pointsCost}</span>
        <span className="cost-label">points</span>
      </div>
      <div className="reward-description">{reward.description}</div>
      <div className="reward-expiry">Expires: {reward.expiresIn}</div>
      <button 
        className="btn-redeem" 
        disabled={!canRedeem}
        onClick={() => onRedeem(reward)}
      >
        {canRedeem ? 'Redeem Reward' : 'Not Enough Points'}
      </button>
    </div>
  );
};

const PointHistoryItem = ({ item }) => {
  return (
    <div className="history-item">
      <div className="history-date">
        {new Date(item.date).toLocaleDateString()}
      </div>
      <div className="history-description">
        {item.description}
      </div>
      <div className={`history-points ${item.type}`}>
        {item.type === 'earned' ? '+' : '-'}{item.points}
      </div>
    </div>
  );
};

const LoyaltyPoints = ({ user }) => {
  // In a real app, these would come from your backend
  const [points, setPoints] = useState(user.points || 1250);
  const [rewards, setRewards] = useState(mockRewards);
  const [pointHistory, setPointHistory] = useState(mockPointHistory);
  const [activeTab, setActiveTab] = useState('overview');
  const [redeemSuccess, setRedeemSuccess] = useState(null);
  
  const handleRedeemReward = (reward) => {
    if (points >= reward.pointsCost) {
      // Update points
      setPoints(points - reward.pointsCost);
      
      // Add to point history
      const newHistoryItem = {
        id: Date.now(),
        date: new Date().toISOString(),
        points: reward.pointsCost,
        type: 'spent',
        description: `Reward: ${reward.name}`
      };
      
      setPointHistory([newHistoryItem, ...pointHistory]);
      
      // Show success message
      setRedeemSuccess(reward.name);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setRedeemSuccess(null);
      }, 3000);
    }
  };
  
  return (
    <div className="loyalty-points">
      <div className="loyalty-header">
        <h3>Loyalty Program</h3>
        <div className="tab-buttons">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'rewards' ? 'active' : ''}`}
            onClick={() => setActiveTab('rewards')}
          >
            Rewards
          </button>
          <button 
            className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            Points History
          </button>
        </div>
      </div>
      
      {redeemSuccess && (
        <div className="redeem-success">
          Successfully redeemed: {redeemSuccess}
        </div>
      )}
      
      <div className="loyalty-content">
        {activeTab === 'overview' && (
          <PointsOverview points={points} />
        )}
        
        {activeTab === 'rewards' && (
          <div className="rewards-container">
            {rewards.map(reward => (
              <RewardCard 
                key={reward.id} 
                reward={reward}
                userPoints={points}
                onRedeem={handleRedeemReward}
              />
            ))}
          </div>
        )}
        
        {activeTab === 'history' && (
          <div className="history-container">
            <div className="history-header">
              <span>Date</span>
              <span>Description</span>
              <span>Points</span>
            </div>
            
            {pointHistory.length === 0 ? (
              <div className="no-history">
                <p>No point history yet.</p>
              </div>
            ) : (
              pointHistory.map(item => (
                <PointHistoryItem key={item.id} item={item} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoyaltyPoints;