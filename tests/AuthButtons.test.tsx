import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authenticated, unauthenticated } from './fakes/auth0';

describe('Login components are displayed', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('shows Login button if user is logged out', async () => {
    vi.doMock('@auth0/auth0-react', () => ({
      useAuth0: unauthenticated
    }));
    const { default: App } = await import('../src/App');
    render(<App />);
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('shows Log out button and Profile if user is logged in', async () => {
    vi.doMock('@auth0/auth0-react', () => ({
      useAuth0: authenticated
    }));
    const { default: App } = await import('../src/App');
    render(<App />);
    expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument();
    expect(screen.getByText('Tester')).toBeInTheDocument();
    expect(screen.getByText('tester@gmail.com')).toBeInTheDocument();
  });
}); 