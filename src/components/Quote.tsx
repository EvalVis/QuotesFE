import { useAuth0 } from '@auth0/auth0-react';
import { useState } from 'react';
import Comment from './Comment';

export interface Quote {
  _id: string;
  quote: string;
  author: string;
  tags: string[];
  saved: boolean;
}

interface QuoteProps {
  quote: Quote;
  onForget?: (quoteId: string) => void;
}

const QuoteComponent = ({ quote: initialQuote, onForget: onForget = (_) => {} }: QuoteProps) => {
  const [quote, setQuote] = useState<Quote>(initialQuote);
  const { getAccessTokenSilently } = useAuth0();

  const forget = async () => {
      const token = await getAccessTokenSilently();
      
      await fetch(`https://quotesapi.fly.dev/api/quotes/forget/${quote._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setQuote({ ...quote, saved: false });
      onForget(quote._id);
  };

  const save = async () => {
    const token = await getAccessTokenSilently();
    
    await fetch(`https://quotesapi.fly.dev/api/quotes/save/${quote._id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    
    setQuote({ ...quote, saved: true });
  };

  return (
    <div className="quote-item">
      <p className="quote-text">"{quote.quote}"</p>
      <p className="quote-author">- {quote.author}</p>
      <p className="quote-tags">{quote.tags.join(', ')}</p>
      
      {quote.saved ? (
        <button 
          onClick={forget}
          className="forget-button"
        >
          Forget
        </button>
      ) : (
        <button 
          onClick={save}
          className="save-button"
        >
          Save
        </button>
      )}
      
      <Comment quoteId={quote._id} />
    </div>
  );
};

export default QuoteComponent; 