import { vi } from 'vitest';

vi.mock('@auth0/auth0-react', async () => {
    return await import('./src/tests/fakes/auth0');
});
