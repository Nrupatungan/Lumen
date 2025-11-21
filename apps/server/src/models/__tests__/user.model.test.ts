import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import { User } from '../User.js';
import { setupTestDB, teardownTestDB } from '../../tests/setup.js';

beforeAll(async () => await setupTestDB());
afterAll(async () => await teardownTestDB());

describe('User model', () => {
  it('creates a user', async () => {
    const user = await User.create({ email: 'a@b.com', name: 'A' });
    expect(user._id).toBeDefined();
    expect(user.email).toBe('a@b.com');
  });
});
