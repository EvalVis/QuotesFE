import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export interface Comment {
  email: string;
  text: string;
  createdAt: string;
}

interface CommentProps {
  quoteId: string;
  commentData?: Comment;
  onCommentAdded?: () => void;
}

const CommentComponent = ({ quoteId, commentData, onCommentAdded = () => {} }: CommentProps) => {
  const [comment, setComment] = useState('');
  const { user, getAccessTokenSilently } = useAuth0();
  
  if (commentData) {
    const isUserComment = user!.email === commentData.email;
    const date = new Date(commentData.createdAt);
    const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    
    return (
      <div className={`comment-display ${isUserComment ? 'user-comment' : ''}`}>
        <div className="comment-text">{commentData.text}</div>
        <div className="comment-meta">
          <span className="comment-author">
            {isUserComment ? 'You' : commentData.email.split('@')[0]}
          </span>
          <span className="comment-date">{formattedDate}</span>
        </div>
      </div>
    );
  }
  
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
    onCommentAdded();
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

export default CommentComponent; 