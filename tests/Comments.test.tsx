import * as React from 'react';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { comments } from './fakes/comments';
import { quotes } from './fakes/quotes';
import QuoteComponent from '../src/components/Quote';

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

    const firstComment = await screen.findByText(comments[1].text);
    const secondComment = await screen.findByText(comments[0].text);
    const thirdComment = await screen.findByText(comments[2].text);

    expect(firstComment.compareDocumentPosition(secondComment)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(secondComment.compareDocumentPosition(thirdComment)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
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

  it('Comment values are displayed correctly', async () => {
    render(<QuoteComponent quote={quotes[0]} />);

    const viewCommentsButton = screen.getByRole('button', { name: /view comments/i });
    fireEvent.click(viewCommentsButton);

    const firstComment = await screen.findByText(comments[1].text);
    const firstCommentContainer = firstComment.closest('div');
    expect(within(firstCommentContainer!).getByText('You')).toBeInTheDocument();
    const commentDate1 = new Date(comments[1].createdAt);
    const formattedDate1 = `${commentDate1.toLocaleDateString()} ${commentDate1.toLocaleTimeString()}`;
    expect(within(firstCommentContainer!).getByText(formattedDate1)).toBeInTheDocument();

    const thirdComment = await screen.findByText(comments[2].text);
    const thirdCommentContainer = thirdComment.closest('div');
    expect(within(thirdCommentContainer!).getByText(comments[2].username)).toBeInTheDocument();
    const commentDate2 = new Date(comments[2].createdAt);
    const formattedDate2 = `${commentDate2.toLocaleDateString()} ${commentDate2.toLocaleTimeString()}`;
    expect(within(thirdCommentContainer!).getByText(formattedDate2)).toBeInTheDocument();
  });
}); 