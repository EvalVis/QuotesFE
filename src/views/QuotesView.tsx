import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect } from 'react';
import QuoteComponent, {Quote} from '../components/Quote';

const QuotesView = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [quotes, setQuotes] = useState<Quote[]>([]);

  useEffect(() => {
    const fetchRandomQuotes = async () => {
      getAccessTokenSilently()
        .then(token => 
          fetch('https://quotesapi.fly.dev/api/quotes/random', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        )
        .then(response => response.json())
        .then(data => {
          const quotes = data.map((quote: any) => ({
            ...quote,
            saved: false
          }));
          setQuotes(quotes);
        });
    };

    fetchRandomQuotes();
  }, [getAccessTokenSilently]);

  return (
    <div className="quotes-container">
      {quotes.map((quote, index) => (
        <QuoteComponent 
          key={index}
          quote={quote}
        />
      ))}
    </div>
  );
};

export default QuotesView; 