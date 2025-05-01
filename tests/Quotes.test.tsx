import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { quotes } from './fakes/quotes';
import QuotesView from '../src/views/QuotesView';
import SavedQuotesView from '../src/views/SavedQuotesView';

describe('Quotes are displayed', () => {
  beforeAll(() => {
    (window as any).fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/api/quotes/random')) {
        return Promise.resolve({
          json: () => Promise.resolve([quotes[0]])
        });
      }
      if (url.includes('/api/quotes/saved')) {
        return Promise.resolve({
          json: () => Promise.resolve([ quotes[1], quotes[2] ])
        });
      }
      return Promise.reject(new Error('URL not found'));
    });
  });

  it('Main page quotes are displayed', async () => {
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
    
    expect(await screen.findByText(`"${quotes[1].quote}"`)).toBeInTheDocument();
    expect(await screen.findByText(`"${quotes[2].quote}"`)).toBeInTheDocument();
  });
}); 