import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { quotes } from './fakes/quotes';
import QuotesView from '../src/views/QuotesView';
import SavedQuotesView from '../src/views/SavedQuotesView';
import { unauthenticated } from './fakes/auth0';

describe('Quotes are displayed', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  beforeAll(() => {
    (window as any).fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/api/quotes/random')) {
        return Promise.resolve({
          json: () => Promise.resolve([quotes[0]])
        });
      }
      if (url.includes('/api/quotes/saved')) {
        return Promise.resolve({
          json: () => Promise.resolve([quotes[1], quotes[2]])
        });
      }
      return Promise.reject(new Error('URL not found'));
    });
  });

  it('Main page quotes are displayed', async () => {
    vi.doMock('@auth0/auth0-react', () => ({
      useAuth0: unauthenticated
    }));
    const { default: QuotesView } = await import('../src/views/QuotesView');

    render(<QuotesView />);
    expect(await screen.findByText(`"${quotes[0].quote}"`)).toBeInTheDocument();
    expect(await screen.findByText(`- ${quotes[0].author}`)).toBeInTheDocument();
    expect(await screen.findByText(quotes[0].tags.join(', '))).toBeInTheDocument();
  });

  it('Saved quotes are displayed', async () => {
    render(<SavedQuotesView />);

    await waitFor(() => {
      expect(screen.getByText(`"${quotes[1].quote}"`)).toBeInTheDocument();
      expect(screen.getByText(`- ${quotes[1].author}`)).toBeInTheDocument();
      expect(screen.getByText(quotes[1].tags.join(', '))).toBeInTheDocument();
    });
  });

  it('Saved quotes are ordered from newest to oldest', async () => {
    render(<SavedQuotesView />);
    
    const firstQuote = await screen.findByText(`"${quotes[2].quote}"`);
    const secondQuote = await screen.findByText(`"${quotes[1].quote}"`);
    
    expect(firstQuote.compareDocumentPosition(secondQuote)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });
}); 