interface Quote {
  quote: string;
  author: string;
  tags: string[];
}

const Quotes = ({ quotes }: { quotes: Quote[] }) => {
  return (
    <div className="quotes-container">
      {quotes.map((quote, index) => (
        <div key={index} className="quote-item">
          <p className="quote-text">"{quote.quote}"</p>
          <p className="quote-author">- {quote.author}</p>
          <p className="quote-tags">{quote.tags.join(', ')}</p>
        </div>
      ))}
    </div>
  );
};

export default Quotes; 