import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import QuoteComponent, {Quote} from '../components/Quote';

const SavedQuotesView = () => {
  const [savedQuotes, setSavedQuotes] = useState<Quote[]>([]);
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  if (!isAuthenticated) {
    return <div className="no-login">Please login to save quotes.</div>;
  }

  useEffect(() => {
    const getSavedQuotes = async () => {
      const token = await getAccessTokenSilently();
      
      const response = await fetch(`${import.meta.env.env.VITE_BE_URL}/api/quotes/saved`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      const quotes = data.map((quote: any) => ({
        ...quote,
        saved: true
      }));
      
      quotes.sort((a: Quote, b: Quote) => new Date(b?.dateSaved || '').getTime() - new Date(a?.dateSaved || '').getTime());
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