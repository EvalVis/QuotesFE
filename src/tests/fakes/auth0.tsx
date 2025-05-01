import { vi } from 'vitest';

export const authenticated = () => ({
  isAuthenticated: true,
  isLoading: false,
  user: { name: 'Tester', email: 'tester@gmail.com' },
  loginWithRedirect: vi.fn(),
  logout: vi.fn(),
  getAccessTokenSilently: vi.fn().mockResolvedValue('tester-token'),
});

export const unauthenticated = () => ({
  isAuthenticated: false,
  isLoading: false,
  loginWithRedirect: vi.fn(),
});