import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect } from 'react';
import ForgetQuoteButton from './ForgetQuoteButton';

interface Quote {
  _id: string;
  quote: string;
  author: string;
  tags: string[];
  saved: boolean;
}

const Quotes = () => {
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
          const quotesWithSavedState = data.map((quote: any) => ({
            ...quote,
            saved: false
          }));
          setQuotes(quotesWithSavedState);
        });
    };

    fetchRandomQuotes();
  }, [getAccessTokenSilently]);

  const saveQuote = async (quoteId: string) => {
    getAccessTokenSilently()
      .then(token => 
        fetch(`https://quotesapi.fly.dev/api/quotes/save/${quoteId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        })
      )
      .then(response => {
        setQuotes(currentQuotes => 
          currentQuotes.map(quote => 
            quote._id === quoteId ? { ...quote, saved: true } : quote
          )
        );
        return response;
      });
  };

  const forgetQuote = (quoteId: string) => {
    setQuotes(currentQuotes => 
      currentQuotes.map(quote => 
        quote._id === quoteId ? { ...quote, saved: false } : quote
      )
    );
  };

  return (
    <div className="quotes-container">
      {quotes.map((quote, index) => (
        <div key={index} className="quote-item">
          <p className="quote-text">"{quote.quote}"</p>
          <p className="quote-author">- {quote.author}</p>
          <p className="quote-tags">{quote.tags.join(', ')}</p>
          {quote.saved ? (
            <ForgetQuoteButton 
              quoteId={quote._id} 
              onForget={() => forgetQuote(quote._id)} 
            />
          ) : (
            <button 
              onClick={() => saveQuote(quote._id)}
              className="save-button"
            >
              Save
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Quotes; 