import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import Profile from './components/Profile'
import Login from './components/Login'
import QuotesView from './views/QuotesView'
import SavedQuotesView from './views/SavedQuotesView'
import './App.css'

type View = 'home' | 'saved';

function App() {
  const [currentView, setCurrentView] = useState<View>('home')
  const { isAuthenticated, isLoading } = useAuth0()

  if (isLoading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="app-container">
      <h1>Quotes API</h1>

      {isAuthenticated ?
        <Profile /> :(
          <div className="login-container">
            <p>Please log in to see quotes</p>
            <Login />
          </div>
        )
      }
      
      <div>
        <nav className="navigation">
          <button 
            onClick={() => setCurrentView('home')} 
            className={`nav-button ${currentView === 'home' ? 'active' : ''}`}
          >
            Home
          </button>
          <button 
            onClick={() => setCurrentView('saved')} 
            className={`nav-button ${currentView === 'saved' ? 'active' : ''}`}
          >
            Saved Quotes
          </button>
        </nav>
        
        {currentView === 'home' && <QuotesView />}
        {currentView === 'saved' && <SavedQuotesView />}
      </div>
    </div>
  )
}

export default App
