import { getSecret, getSecrets } from './secrets'; // Assuming 'secrets.ts' is the file containing your functions

// Mocking the dependencies
jest.mock('fs');
jest.mock('path');

// Mocking the readFileSync function for getSecret
const mockReadFileSync = jest.fn();
jest.mock('fs', () => ({
  readFileSync: mockReadFileSync,
}));

// Mocking the readdirSync and lstatSync functions for getSecrets
const mockReaddirSync = jest.fn();
const mockLstatSync = jest.fn();
jest.mock('fs', () => ({
  ...jest.requireActual('fs'), // Preserve the original fs module
  readdirSync: mockReaddirSync,
  lstatSync: mockLstatSync,
}));

describe('getSecret', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls after each test
  });

  test('should return secret value from file', () => {
    // Mocking file read operation
    const mockSecretValue = 'mySecretValue';
    mockReadFileSync.mockReturnValueOnce(mockSecretValue);

    const secretName = 'mySecret';
    const secret = getSecret(secretName);
    
    expect(secret).toBe(mockSecretValue);
    expect(mockReadFileSync).toHaveBeenCalledWith(secretName, 'utf8');
  });

  test('should return default value if secret file does not exist', () => {
    // Mocking file read operation to throw an error
    mockReadFileSync.mockImplementationOnce(() => {
      throw new Error('File not found');
    });

    const secretName = 'nonExistentSecret';
    const defaultValue = 'defaultSecretValue';
    const secret = getSecret(secretName, defaultValue);
    
    expect(secret).toBe(defaultValue);
    expect(mockReadFileSync).toHaveBeenCalledWith(secretName, 'utf8');
  });

  // Add more test cases to cover other scenarios if necessary
});

describe('getSecrets', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls after each test
  });

  test('should return secrets from files in directory', () => {
    // Mocking file system operations
    mockReaddirSync.mockReturnValueOnce(['secret1.txt', 'secret2.txt']);
    mockLstatSync.mockReturnValueOnce({ isDirectory: () => false });
    mockReadFileSync.mockReturnValueOnce('value1').mockReturnValueOnce('value2');

    const secrets = getSecrets();

    expect(secrets).toEqual({ 'secret1.txt': 'value1', 'secret2.txt': 'value2' });
    expect(mockReaddirSync).toHaveBeenCalledWith(expect.any(String));
    expect(mockLstatSync).toHaveBeenCalledTimes(2);
    expect(mockReadFileSync).toHaveBeenCalledTimes(2);
  });

  test('should return an empty object if directory does not exist', () => {
    // Mocking readdirSync to throw an error
    mockReaddirSync.mockImplementationOnce(() => {
      throw new Error('Directory not found');
    });

    const secrets = getSecrets();

    expect(secrets).toEqual({});
    expect(mockReaddirSync).toHaveBeenCalledWith(expect.any(String));
  });

  // Add more test cases to cover other scenarios if necessary
});
