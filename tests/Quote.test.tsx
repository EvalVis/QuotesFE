import * as React from 'react';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import QuoteComponent from '../src/components/Quote';
import { quotes } from './fakes/quotes';
import SavedQuotesView from '../src/views/SavedQuotesView';

describe('Quote works as expected', () => {
  beforeEach(() => {
    vi.resetModules();
    (window as any).fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/api/quotes/saved')) {
        return Promise.resolve({
          json: () => Promise.resolve([quotes[1], quotes[2]])
        });
      }
      if (url.includes('/api/quotes/save')) {
        return Promise.resolve();
      }
      if (url.includes('/api/quotes/forget')) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('URL not found'));
    });
  });

  it('Save button changes to forget when clicked', async () => {
    render(<QuoteComponent quote={quotes[0]} />);

    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /forget/i })).toBeInTheDocument();
    });
  });

  it('Forget button changes to save when clicked', async () => {
    render(<QuoteComponent quote={quotes[1]} />);

    const forgetButton = screen.getByRole('button', { name: /forget/i });
    fireEvent.click(forgetButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    });
  });

  it('Quote is removed from saved quotes list when forgotten', async () => {
    render(<SavedQuotesView />);

    const quoteText = await screen.findByText(`"${quotes[1].quote}"`);
    const quoteContainer = quoteText.closest('div');
    
    const forgetButton = within(quoteContainer!).getByRole('button', { name: /forget/i });
    fireEvent.click(forgetButton);

    expect(await screen.findByText(`"${quotes[1].quote}"`)).not.toBeInTheDocument();
  });
}); 