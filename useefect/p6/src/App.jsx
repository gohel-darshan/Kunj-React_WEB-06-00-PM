import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [userId, setUserId] = useState(1)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then(data => {
        console.log(data)
        setUserData(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching data:', error)
        setError('Failed to fetch data')
        setLoading(false)
      })
  }, [userId])

  return (
    <div className="website">
      {/* Header Section */}
      <header className="header">
        <div className="logo">UserBook</div>
        <nav className="navigation">
          <a href="#" className="active">Home</a>
          <a href="#">About</a>
          <a href="#">Services</a>
          <a href="#">Contact</a>
        </nav>
        <div className="user-controls">
          <button onClick={() => setUserId(prevId => Math.max(1, prevId - 1))}>Previous User</button>
          <span className="user-id">User ID: {userId}</span>
          <button onClick={() => setUserId(prevId => prevId + 1)}>Next User</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading user data...</p>
          </div>
        )}
        
        {error && (
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h3>Error</h3>
            <p>{error}</p>
          </div>
        )}
        
        {userData && !loading && !error && (
          <div className="profile-container">
            <div className="profile-header">
              <div className="profile-avatar">
                <span>{userData.name.charAt(0)}</span>
              </div>
              <div className="profile-title">
                <h1>{userData.name}</h1>
                <h2>@{userData.username}</h2>
              </div>
            </div>
            
            <div className="info-sections">
              <div className="info-section">
                <h3>Contact Information</h3>
                <div className="info-card">
                  <div className="info-item">
                    <span className="info-label">Email:</span>
                    <span className="info-value">{userData.email}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Phone:</span>
                    <span className="info-value">{userData.phone}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Website:</span>
                    <a href={`https://${userData.website}`} className="info-value website-link">{userData.website}</a>
                  </div>
                </div>
              </div>
              
              <div className="info-section">
                <h3>Address</h3>
                <div className="info-card">
                  <div className="info-item">
                    <span className="info-label">Street:</span>
                    <span className="info-value">{userData.address.street}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Suite:</span>
                    <span className="info-value">{userData.address.suite}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">City:</span>
                    <span className="info-value">{userData.address.city}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Zipcode:</span>
                    <span className="info-value">{userData.address.zipcode}</span>
                  </div>
                  <div className="map-link">
                    <a href={`https://maps.google.com/?q=${userData.address.geo.lat},${userData.address.geo.lng}`} target="_blank" rel="noopener noreferrer">
                      View on Map
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="info-section">
                <h3>Company</h3>
                <div className="info-card">
                  <div className="info-item">
                    <span className="info-label">Name:</span>
                    <span className="info-value">{userData.company.name}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Catch Phrase:</span>
                    <span className="info-value catchphrase">"{userData.company.catchPhrase}"</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Business:</span>
                    <span className="info-value">{userData.company.bs}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Section */}
      <footer className="footer">
        <p>&copy; 2024 UserBook - User data provided by JSONPlaceholder API</p>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Us</a>
        </div>
      </footer>
    </div>
  )
}

export default App
