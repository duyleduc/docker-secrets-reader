import { getSecret } from '../src/index'; // Assuming 'secrets.ts' is the file containing your functions
import fs from 'fs';
import path from 'path';

jest.mock('fs');

describe('getSecret', () => {
  const envSecretValue = 'envSecretValue';

  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls after each test
    delete process.env.mySecret;
  });

  test('should return secret value from env', () => {

    process.env.mySecret = envSecretValue;

    const secret = getSecret(process.env.mySecret);

    expect(secret).toBe(envSecretValue);
  });
});
