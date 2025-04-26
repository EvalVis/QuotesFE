import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [response, setResponse] = useState('')

  useEffect(() => {
    fetch('https://quotesapi.fly.dev')
      .then(res => res.text())
      .then(data => setResponse(data))
  }, [])

  return (
    <div>
      <h1>Quotes API</h1>
      <p>{response}</p>
    </div>
  )
}

export default App
