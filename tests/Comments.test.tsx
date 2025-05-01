import * as React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { comments } from './fakes/comments';
import QuoteComponent from '../src/components/Quote';
import { quotes } from './fakes/quotes';

describe('Comments work as expected', () => {
  beforeEach(() => {
    vi.resetModules();
    (window as any).fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/api/quotes/comments')) {
        return Promise.resolve({
          json: () => Promise.resolve(comments)
        });
      }
      return Promise.reject(new Error('URL not found'));
    });
  });

  it('Comments are displayed in correct order when View comments button is clicked', async () => {
    render(<QuoteComponent quote={quotes[0]} />);

    const viewCommentsButton = screen.getByRole('button', { name: /view comments/i });
    fireEvent.click(viewCommentsButton);

    expect(await screen.findByText(comments[1].text)).toBeInTheDocument();
    expect(await screen.findByText(comments[0].text)).toBeInTheDocument();
    expect(await screen.findByText(comments[2].text)).toBeInTheDocument();
  });

  it('Logged in user can create a comment', async () => {
    render(<QuoteComponent quote={quotes[0]} />);

    (window as any).fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/api/quotes/comments')) {
        return Promise.resolve({
          json: () => Promise.resolve(comments)
        });
      }
      else if (url.includes('/api/quotes/addComment')) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('URL not found'));
      });

    const viewCommentsButton = screen.getByRole('button', { name: /view comments/i });
    fireEvent.click(viewCommentsButton);

    const commentInput = await screen.findByPlaceholderText(/Comment here/i);
    fireEvent.change(commentInput, { target: { value: 'New comment' } });

    const sendButton = screen.getByRole('button', { name: /Add comment/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/quotes/addComment'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          })
        })
      );
    });
  });
}); 