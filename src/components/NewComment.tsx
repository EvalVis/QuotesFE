import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const NewComment = ({ quoteId }: { quoteId: string }) => {
  const [comment, setComment] = useState('');
  const { getAccessTokenSilently } = useAuth0();
  
  const addComment = async () => {    
    const token = await getAccessTokenSilently();
    
    await fetch(`https://quotesapi.fly.dev/api/quotes/addComment/${quoteId}`, {
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