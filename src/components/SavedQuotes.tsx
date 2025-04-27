import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import ForgetQuoteButton from './ForgetQuoteButton';

interface Quote {
  _id: string;
  quote: string;
  author: string;
  tags: string[];
}

const SavedQuotes = () => {
  const [savedQuotes, setSavedQuotes] = useState<Quote[]>([]);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const getSavedQuotes = async () => {
      const token = await getAccessTokenSilently();
      
      const response = await fetch('https://quotesapi.fly.dev/api/quotes/saved', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      setSavedQuotes(data);
    };

    getSavedQuotes();
  }, [getAccessTokenSilently]);

  const forgetQuote = (quoteId: string) => {
    setSavedQuotes(currentQuotes => 
      currentQuotes.filter(quote => quote._id !== quoteId)
    );
  };

  if (savedQuotes.length === 0) {
    return <div className="no-quotes">You have not saved any quotes yet.</div>;
  }

  return (
    <div className="saved-quotes">
      <h2>Your Saved Quotes</h2>
      <div className="quotes-container">
        {savedQuotes.map((quote) => (
          <div key={quote._id} className="quote-item">
            <p className="quote-text">"{quote.quote}"</p>
            <p className="quote-author">- {quote.author}</p>
            <p className="quote-tags">{quote.tags.join(', ')}</p>
            <ForgetQuoteButton 
              quoteId={quote._id} 
              onForget={() => forgetQuote(quote._id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedQuotes; 