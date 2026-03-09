"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import QuoteComponent, { Quote } from "../components/Quote";

const PAGE_SIZE = 100;

const PopularQuotesView = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  const uniqueTags = useMemo(() => {
    const tags = new Set<string>();
    quotes.forEach((q) => q.tags?.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [quotes]);

  const filteredQuotes = useMemo(() => {
    if (!selectedTag) return quotes;
    return quotes.filter((q) => q.tags?.includes(selectedTag));
  }, [quotes, selectedTag]);

  const totalPages = useMemo(() => {
    if (totalCount === null) return 1;
    return Math.ceil(totalCount / PAGE_SIZE);
  }, [totalCount]);

  const fetchPopularQuotes = async (page: number) => {
    setLoading(true);
    setError(null);

    const offset = (page - 1) * PAGE_SIZE;

    try {
      let request: Promise<Response>;
      const url = `${import.meta.env.VITE_BE_URL}/api/quotes/popular?limit=${PAGE_SIZE}&offset=${offset}`;

      if (isAuthenticated) {
        const token = await getAccessTokenSilently();
        request = fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        request = fetch(url);
      }

      const response = await request;

      if (!response.ok) {
        throw new Error("Failed to fetch popular quotes");
      }

      const data = await response.json();

      // Support both array response and { quotes, total } response
      const quotesData = Array.isArray(data) ? data : data.quotes || [];
      const total = Array.isArray(data) ? null : data.total ?? null;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mappedQuotes = quotesData.map((quote: any) => ({
        ...quote,
        saved: quote.saved ?? false,
      }));

      setQuotes(mappedQuotes);
      setTotalCount(total);
      setCurrentPage(page);
      setSelectedTag(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load popular quotes",
      );
      setQuotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopularQuotes(1);
    // Re-fetch when auth state changes (user logs in/out)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const handleTagClick = (tag: string) => {
    setSelectedTag((prev) => (prev === tag ? null : tag));
  };

  const handlePageChange = (page: number) => {
    fetchPopularQuotes(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading && quotes.length === 0) {
    return <div className="popular-quotes-loading">Loading popular quotes...</div>;
  }

  if (error && quotes.length === 0) {
    return (
      <div className="popular-quotes-error">
        <p>{error}</p>
        <p className="popular-quotes-error-hint">
          The popular quotes API may not be available yet. Please try again
          later.
        </p>
        <button
          type="button"
          onClick={() => fetchPopularQuotes(1)}
          className="refresh-button"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="popular-quotes">
      <h2>Top 100 Popular Quotes</h2>
      <p className="popular-quotes-description">
        Quotes saved most often by users. The wisdom of the crowd.
      </p>

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
        {loading ? (
          <div className="popular-quotes-loading-inline">
            Refreshing...
          </div>
        ) : filteredQuotes.length === 0 && selectedTag ? (
          <p className="no-quotes-filtered">
            No popular quotes with tag #{selectedTag}. Try another tag.
          </p>
        ) : filteredQuotes.length === 0 ? (
          <p className="no-quotes-filtered">No popular quotes found.</p>
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

      {totalPages > 1 && !selectedTag && (
        <div className="pagination">
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
            {totalCount !== null && ` (${totalCount} total)`}
          </span>
          <div className="pagination-buttons">
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1 || loading}
              className="pagination-button"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={
                currentPage >= totalPages ||
                loading ||
                (totalCount !== null && quotes.length < PAGE_SIZE)
              }
              className="pagination-button"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PopularQuotesView;
