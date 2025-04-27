import { useAuth0 } from '@auth0/auth0-react';

export interface Comment {
    email: string;
    text: string;
    createdAt: string;
  } 

const ExistingComment = ({ commentData }: { commentData: Comment }) => {
  const { user } = useAuth0();
  
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
};

export default ExistingComment; 