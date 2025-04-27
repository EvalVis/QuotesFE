import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Auth0Provider
      domain="dev-wzfkg4o26oz6ndmt.us.auth0.com"
      clientId="v0YzxpAoJP6tLyW29TnZEuqStYkUF5fY"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "quotes.programmersdiary.com"
      }}
      cacheLocation="localstorage"
    >
      <App />
    </Auth0Provider>
  </StrictMode>,
)
