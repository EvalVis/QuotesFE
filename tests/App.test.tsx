import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import '@testing-library/jest-dom';
import App from '../src/App';

describe('Main components are displayed', () => {
  beforeAll(() => {
    vi.mock('../src/views/QuotesView', () => ({
      default: () => <div>QuotesView</div>
    }));
  });

  beforeEach(() => {
    render(<App />);
  });

  it('Renders a header', () => {
    expect(screen.getByRole('heading', { name: /quotes/i })).toBeInTheDocument();
  });

  it('Displays home and saved quotes buttons', () => {
    expect(screen.getByRole('button', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /saved quotes/i })).toBeInTheDocument();
  });
}); 
