import { useAuth0 } from '@auth0/auth0-react';

interface ForgetQuoteButtonProps {
  quoteId: string;
  onForget: () => void;
}

const ForgetQuoteButton = ({ quoteId, onForget }: ForgetQuoteButtonProps) => {
  const { getAccessTokenSilently } = useAuth0();

  const forgetQuote = async () => {
    const token = await getAccessTokenSilently();
    
    await fetch(`https://quotesapi.fly.dev/api/quotes/forget/${quoteId}`, {
    method: 'DELETE',
    headers: {
        Authorization: `Bearer ${token}`
    }
    }).then(_ => onForget());
  };

  return (
    <button 
      onClick={forgetQuote}
      className='forget-button'
    >
      Forget
    </button>
  );
};

export default ForgetQuoteButton; 