import { getSecret, getSecrets } from '../src/index'; // Assuming 'secrets.ts' is the file containing your functions
import fs from 'fs';
import path from 'path';

// Mocking the dependencies
jest.mock('fs');
// jest.mock('path');

describe('getSecret', () => {
  beforeEach(() => {
    // Set the desired environment variable
    process.env.MY_ENV_VARIABLE = 'my_value';
  });


  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls after each test
    delete process.env.MY_ENV_VARIABLE;

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

    const secretName = 'mySecret';
    

  });

  // test('should return default value if secret file does not exist', () => {
  //   // Mocking file read operation to throw an error
  //   mockReadFileSync.mockImplementationOnce(() => {
  //     throw new Error('File not found');
  //   });

  //   const secretName = 'nonExistentSecret';
  //   const defaultValue = 'defaultSecretValue';
  //   const secret = getSecret(secretName, defaultValue);
    
  //   expect(secret).toBe(defaultValue);
  //   expect(mockReadFileSync).toHaveBeenCalledWith(secretName, 'utf8');
  // });

  // Add more test cases to cover other scenarios if necessary
});

// describe('getSecrets', () => {
//   afterEach(() => {
//     jest.clearAllMocks(); // Clear mock calls after each test
//   });

//   test('should return secrets from files in directory', () => {
//     // Mocking file system operations
//     mockReaddirSync.mockReturnValueOnce(['secret1.txt', 'secret2.txt']);
//     mockLstatSync.mockReturnValueOnce({ isDirectory: () => false });
//     mockReadFileSync.mockReturnValueOnce('value1').mockReturnValueOnce('value2');

//     const secrets = getSecrets();

//     expect(secrets).toEqual({ 'secret1.txt': 'value1', 'secret2.txt': 'value2' });
//     expect(mockReaddirSync).toHaveBeenCalledWith(expect.any(String));
//     expect(mockLstatSync).toHaveBeenCalledTimes(2);
//     expect(mockReadFileSync).toHaveBeenCalledTimes(2);
//   });

//   test('should return an empty object if directory does not exist', () => {
//     // Mocking readdirSync to throw an error
//     mockReaddirSync.mockImplementationOnce(() => {
//       throw new Error('Directory not found');
//     });

//     const secrets = getSecrets();

//     expect(secrets).toEqual({});
//     expect(mockReaddirSync).toHaveBeenCalledWith(expect.any(String));
//   });

//   // Add more test cases to cover other scenarios if necessary
// });
