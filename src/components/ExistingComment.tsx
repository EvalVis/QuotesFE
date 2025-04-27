export interface Comment {
  id: string;
  text: string;
  username: string;
  isOwner: boolean;
  createdAt: string;
}

const ExistingComment = ({ comment }: { comment: Comment }) => {
    const date = new Date(comment.createdAt);
    const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

  return (
    <div className={`comment ${comment.isOwner ? 'user-comment' : ''}`}>
      <p className="comment-text">{comment.text}</p>
      <div className="comment-footer">
        <span className="comment-author">
          {comment.isOwner ? 'You' : comment.username}
        </span>
        <span className="comment-date">{formattedDate}</span>
      </div>
    </div>
  );
};

export default ExistingComment;
