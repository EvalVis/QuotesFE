"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import QuoteComponent, { Quote } from "../components/Quote";

const SavedQuotesView = () => {
  const [savedQuotes, setSavedQuotes] = useState<Quote[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  const uniqueTags = useMemo(() => {
    const tags = new Set<string>();
    savedQuotes.forEach((q) => q.tags?.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [savedQuotes]);

  const filteredQuotes = useMemo(() => {
    if (!selectedTag) return savedQuotes;
    return savedQuotes.filter((q) => q.tags?.includes(selectedTag));
  }, [savedQuotes, selectedTag]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const getSavedQuotes = async () => {
      const token = await getAccessTokenSilently();

      const response = await fetch(
        `${import.meta.env.VITE_BE_URL}/api/quotes/saved`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const quotes = data.map((quote: any) => ({
        ...quote,
        saved: true,
      }));

      quotes.sort(
        (a: Quote, b: Quote) =>
          new Date(b?.dateSaved || "").getTime() -
          new Date(a?.dateSaved || "").getTime(),
      );
      setSavedQuotes(quotes);
    };

    getSavedQuotes();
  }, [isAuthenticated, getAccessTokenSilently]);

  const handleForget = (quoteId: string) => {
    setSavedQuotes((currentQuotes) =>
      currentQuotes.filter((quote) => quote._id !== quoteId),
    );
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag((prev) => (prev === tag ? null : tag));
  };

  if (!isAuthenticated) {
    return <div className="no-login">Please login to save quotes.</div>;
  }

  if (savedQuotes.length === 0) {
    return <div className="no-quotes">You have not saved any quotes yet.</div>;
  }

  return (
    <div className="saved-quotes">
      <h2>Your Saved Quotes</h2>
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
      <div className="quotes-container">
        {filteredQuotes.length === 0 && selectedTag ? (
          <p className="no-quotes-filtered">
            No saved quotes with tag #{selectedTag}. Try another tag.
          </p>
        ) : (
          filteredQuotes.map((quote) => (
            <QuoteComponent
              key={quote._id}
              quote={quote}
              onForget={handleForget}
              onTagClick={handleTagClick}
              selectedTag={selectedTag}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default SavedQuotesView;
