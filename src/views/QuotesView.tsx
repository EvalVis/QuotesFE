import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect, useMemo } from "react";
import QuoteComponent, { Quote } from "../components/Quote";

const QuotesView = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const uniqueTags = useMemo(() => {
    const tags = new Set<string>();
    quotes.forEach((q) => q.tags?.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [quotes]);

  const filteredQuotes = useMemo(() => {
    if (!selectedTag) return quotes;
    return quotes.filter((q) => q.tags?.includes(selectedTag));
  }, [quotes, selectedTag]);
  console.log("filteredQuotes", filteredQuotes);

  function fetchRandomQuotes() {
    let request;
    if (isAuthenticated) {
      request = getAccessTokenSilently().then((token) =>
        fetch(`${import.meta.env.VITE_BE_URL}/api/quotes/random`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      );
    } else {
      request = fetch(`${import.meta.env.VITE_BE_URL}/api/quotes/random`);
    }
    request
      .then((response) => response.json())
      .then((data) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const q = data.map((quote: any) => ({
          ...quote,
          saved: false,
        }));
        setQuotes(q);
        setSelectedTag(null);
      });
  }

  useEffect(() => {
    fetchRandomQuotes();
  }, []);

  const handleTagClick = (tag: string) => {
    setSelectedTag((prev) => (prev === tag ? null : tag));
  };

  return (
    <div className="quotes-container">
      <button onClick={fetchRandomQuotes} className="refresh-button">
        Refresh Quotes
      </button>
      {uniqueTags.length > 0 && (
        <div className="tag-filter-section">
          <span className="tag-filter-label">Filter by tag:</span>
          <div className="tag-filter-list">
            {uniqueTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagClick(tag)}
                className={`tag-filter-chip ${selectedTag === tag ? "active" : ""}`}
              >
                #{tag}
              </button>
            ))}
            {selectedTag && (
              <button
                type="button"
                onClick={() => setSelectedTag(null)}
                className="tag-filter-clear"
              >
                Clear filter
              </button>
            )}
          </div>
        </div>
      )}
      {filteredQuotes.length === 0 ? (
        <p className="no-quotes-filtered">
          {selectedTag
            ? `No quotes with tag #${selectedTag}. Try another tag or refresh.`
            : "Loading quotes..."}
        </p>
      ) : (
        filteredQuotes.map((quote) => (
          <QuoteComponent
            key={quote._id}
            quote={quote}
            onTagClick={handleTagClick}
            selectedTag={selectedTag}
          />
        ))
      )}
    </div>
  );
};

export default QuotesView;
