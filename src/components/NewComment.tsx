import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

interface NewCommentProps {
  quoteId: string;
  onCommentAdded: () => Promise<void>;
}

const NewComment = ({ quoteId, onCommentAdded }: NewCommentProps) => {
  const [comment, setComment] = useState('');
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  if (!isAuthenticated) {
    return <div className="no-login">Please login to comment.</div>;
  }
  
  const addComment = async () => {    
    const token = await getAccessTokenSilently();
    
    await fetch(`${import.meta.env.VITE_BE_URL}/api/quotes/addComment/${quoteId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        comment: comment.trim()
      })
    });
    
    setComment('');
    await onCommentAdded();
  };

  return (
    <div className="comment-section">
      <textarea 
        placeholder="Comment here"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="comment-input"
      />
      <button 
        onClick={addComment}
        disabled={!comment.trim()}
        className="comment-button"
      >
        Add Comment
      </button>
    </div>
  );
};

export default NewComment; 