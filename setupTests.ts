import { vi } from 'vitest';
import '@testing-library/jest-dom';
import { authenticated } from './tests/fakes/auth0';

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: authenticated
}));
