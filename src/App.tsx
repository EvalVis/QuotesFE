import { useState, useEffect } from 'react'
import './App.css'

interface Quote {
  quote: string;
  author: string;
  tags: string[];
}

function App() {
  const [quotes, setQuotes] = useState<Quote[]>([])

  useEffect(() => {
    fetch('https://quotesapi.fly.dev/api/quotes/random')
      .then(res => res.json())
      .then(data => setQuotes(data))
  }, [])

  return (
    <div>
      <h1>Quotes API</h1>
      <hr />
      {quotes.map((quote, index) => (
        <div key={index}>
          <p>"{quote.quote}"</p>
          <p>- {quote.author}</p>
          <p>{quote.tags.join(', ')}</p>
          <hr />
        </div>
      ))}
    </div>
  )
}

export default App
