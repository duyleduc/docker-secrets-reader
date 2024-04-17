import { Secrets, getSecret, getSecrets } from '../src/index'; // Assuming 'secrets.ts' is the file containing your functions
import fs from 'fs';
import path from 'path';

jest.mock('fs');

describe('getSecret', () => {
  const envSecretValue = 'envSecretValue';


  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls after each test
    delete process.env.mySecret;
  });

  test('should return secret value from file', () => {
    const mockSecretValue = 'mySecretValue';
    //@ts-ignore
    fs.readFileSync.mockReturnValueOnce(mockSecretValue);

    const secretName = 'mySecret';
    const secret = getSecret(secretName);

    expect(secret).toBe(mockSecretValue);
    expect(fs.readFileSync).toHaveBeenCalledWith(path.join(secretName), 'utf8');
  });

  test('should return secret value from env', () => {

    process.env.mySecret = envSecretValue;

    const secretName = 'mySecret';
    const secret = getSecret(secretName);
    expect(secret).toBe(envSecretValue);
    expect(fs.readFileSync).toHaveBeenCalledWith(path.join(secretName), 'utf8');
  });

  test('should return default value if secret file and env variable do not exist', () => {
    const secretName = 'nonExistentSecret';
    const defaultValue = 'defaultSecretValue';
    const secret = getSecret(secretName, defaultValue);

    expect(secret).toBe(defaultValue);
    expect(fs.readFileSync).toHaveBeenCalledWith(path.join(secretName), 'utf8');
  });
});
