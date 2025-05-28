import { useAuth0 } from '@auth0/auth0-react';
import { useState } from 'react';
import NewComment from './NewComment';
import ExistingComment, {Comment} from './ExistingComment';

export interface Quote {
  _id: string;
  quote: string;
  author: string;
  tags: string[];
  saved: boolean;
  dateSaved?: string;
}

interface QuoteProps {
  quote: Quote;
  onForget?: (quoteId: string) => void;
}

const QuoteComponent = ({ quote: initialQuote, onForget: onForget = (_) => {} }: QuoteProps) => {
  const [quote, setQuote] = useState<Quote>(initialQuote);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

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
    if (!showComments && comments.length === 0) {
      await refreshComments();
    }

    setShowComments(!showComments);
  };
  
  const fetchCommentsWhileLoggedIn = async () => {
    const token = await getAccessTokenSilently();
    const response = await fetch(`${import.meta.env.VITE_BE_URL}/api/quotes/comments/${quote._id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    const commentData = await response.json();
    
    let sortedComments = [...commentData].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    sortedComments = [
      ...sortedComments.filter(c => c.isOwner),
      ...sortedComments.filter(c => !c.isOwner)
    ];
    
    setComments(sortedComments);
  };

  const fetchCommentsWhileNotLoggedIn = async () => {
    await fetch(
      `${import.meta.env.VITE_BE_URL}/api/quotes/comments/${quote._id}`
    ).then(response => response.json())
    .then(data => {
      setComments(data);
    });
  };

  const refreshComments = async () => {
    if (isAuthenticated) {
      await fetchCommentsWhileLoggedIn();
    } else {
      await fetchCommentsWhileNotLoggedIn();
    }
  };

  return (
    <div className="quote-item">
      <div className="px-6 py-4">
        <div className="quote-text">"{quote.quote}"</div>
        <p className="quote-author">- {quote.author}</p>
    </div>
    <div className="quote-tags">
    {quote.tags.map((tag) => (
      <span
        key={tag}
        className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
      >
        #{tag}
      </span>
    ))}
    </div>
      
      {isAuthenticated && 
        (quote.saved ? (
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
          )
        )
      }
      
      
      <div className="comments-container">
        <button 
          onClick={toggleComments} 
          className="comments-toggle"
        >
          {showComments ? 'Hide Comments' : 'View Comments'}
        </button>
        
        {showComments && (
          <div className="comments-section">
                <NewComment quoteId={quote._id} onCommentAdded={refreshComments} />
                
                <div className="comments-list">
                  {comments.length === 0 ? (
                    <p className="no-comments">No comments yet. Be the first to comment!</p>
                  ) : (
                    comments.map((comment) => (
                      <ExistingComment 
                        key={comment._id}
                        comment={comment} 
                      />
                    ))
                  )}
                </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuoteComponent; 