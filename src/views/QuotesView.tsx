import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect } from 'react';
import QuoteComponent, {Quote} from '../components/Quote';

const QuotesView = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [quotes, setQuotes] = useState<Quote[]>([]);

  function fetchRandomQuotes() {
    let request;
    if (isAuthenticated) {
      request = getAccessTokenSilently()
      .then(token => 
        fetch(`${import.meta.env.VITE_BE_URL}/api/quotes/random`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      )
    } else {
      request = fetch(`${import.meta.env.VITE_BE_URL}/api/quotes/random`)
    }
    request
      .then(response => response.json())
      .then(data => {
        const q = data.map((quote: any) => ({
          ...quote,
          saved: false
        }));
        setQuotes(q);
      });
  }

  useEffect(() => {
    fetchRandomQuotes();
  }, []);

  return (
    <div className="quotes-container">
      <button 
        onClick={fetchRandomQuotes}
        className="refresh-button"
      >
        Refresh Quotes
      </button>
      {quotes.map((quote) => (
        <QuoteComponent 
          key={quote._id}
          quote={quote}
        />
      ))}
    </div>
  );
};

export default QuotesView; 