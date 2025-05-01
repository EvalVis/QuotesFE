import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import App from '../App';

describe('Renders main components', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('renders a header', () => {
    expect(screen.getByRole('heading', { name: /quotes/i })).toBeInTheDocument();
  });

  it('Home and Saved Quotes buttons are displayed', () => {
    expect(screen.getByRole('button', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /saved quotes/i })).toBeInTheDocument();
  });
}); 
