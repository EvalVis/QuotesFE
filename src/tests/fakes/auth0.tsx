import { vi } from 'vitest';

export const useAuth0 = () => ({
  isAuthenticated: true,
  isLoading: false,
  user: { name: 'Tester', email: 'tester@example.com' },
  loginWithRedirect: vi.fn(),
  logout: vi.fn(),
  getAccessTokenSilently: vi.fn().mockResolvedValue('tester-token'),
});
