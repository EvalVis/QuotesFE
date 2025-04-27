import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import QuoteComponent from '../components/Quote';

const SavedQuotesView = () => {
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
      const quotes = data.map((quote: any) => ({
        ...quote,
        saved: true
      }));
      setSavedQuotes(quotes);
    };

    getSavedQuotes();
  }, [getAccessTokenSilently]);

  const handleForget = (quoteId: string) => {
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
          <QuoteComponent 
            key={quote._id}
            quote={quote}
            onForget={handleForget}
          />
        ))}
      </div>
    </div>
  );
};

export default SavedQuotesView; 