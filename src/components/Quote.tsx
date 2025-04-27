import { useAuth0 } from '@auth0/auth0-react';
import { useState } from 'react';
import CommentComponent, {Comment} from './Comment';

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
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<CommentData[]>([]);
  const { user, getAccessTokenSilently } = useAuth0();

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
  
  const toggleComments = async () => {    
    if (showComments && comments.length === 0) {
      await fetchComments();
    }

    setShowComments(!showComments);
  };
  
  const fetchComments = async () => {
    const token = await getAccessTokenSilently();
    const response = await fetch(`https://quotesapi.fly.dev/api/quotes/comments/${quote._id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    const commentData = await response.json();
    
    let sortedComments = [...commentData].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    sortedComments = [
      ...sortedComments.filter(c => c.email === user!.email),
      ...sortedComments.filter(c => c.email !== user!.email)
    ];
    
    setComments(sortedComments);
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
      
      <div className="comments-container">
        <button 
          onClick={toggleComments} 
          className="comments-toggle"
        >
          {showComments ? 'Hide Comments' : 'View Comments'}
        </button>
        
        {showComments && (
          <div className="comments-section">
              <div>
                <Comment 
                  quoteId={quote._id} 
                  onCommentAdded={fetchComments}
                />
                
                <div className="comments-list">
                  {comments.length === 0 ? (
                    <p className="no-comments">No comments yet. Be the first to comment!</p>
                  ) : (
                    comments.map((comment, index) => (
                      <Comment 
                        key={index}
                        quoteId={quote._id} 
                        commentData={comment} 
                        userEmail={user!.email}
                      />
                    ))
                  )}
                </div>
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuoteComponent; 