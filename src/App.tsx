import { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import Profile from './components/Profile'
import Login from './components/Login'
import Quotes from './components/Quotes'
import './App.css'

interface Quote {
  quote: string;
  author: string;
  tags: string[];
}

function App() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0()

  useEffect(() => {
    if (isAuthenticated) {
      (async () => {
        const token = await getAccessTokenSilently()
      
        const response = await fetch('https://quotesapi.fly.dev/api/quotes/random', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        
        const data = await response.json()
        setQuotes(data)
      })()
    }
  }, [isAuthenticated, getAccessTokenSilently])

  if (isLoading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="app-container">
      <h1>Quotes API</h1>
      
      {isAuthenticated ? (
        <div>
          <Profile />
          {quotes.length > 0 && <Quotes quotes={quotes} />}
        </div>
      ) : (
        <div className="login-container">
          <p>Please log in to see quotes</p>
          <Login />
        </div>
      )}
    </div>
  )
}

export default App
