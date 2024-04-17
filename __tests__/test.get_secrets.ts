import fs from 'fs';
import path from 'path';
import { getSecrets } from '../src';

describe('getSecrets', () => {

    test('should return secrets from files in directory', () => {
        const secretDir = createSecretDir();
        const credentials = {
            username: 'username',
            password: 'my_secret_password'
        };

        createSecretFiles(secretDir, credentials);

        const secrets = getSecrets<typeof credentials>(secretDir);

        expect(secrets).toEqual(credentials);
        expect(secrets.password).toEqual('my_secret_password');
        expect(secrets.username).toEqual('username');

        deleteSecretDir(secretDir);
    });


    it("should return empty secrets object if directory does not exist", async () => {
        const secrets = getSecrets(path.join(__dirname, "NON_EXISTENT_DIR"));
        expect(secrets).toEqual({});
      });
});

const createSecretFiles = (dir: string, secrets: { [key: string]: string }) => {
    Object.keys(secrets).map((key) =>
        fs.writeFileSync(path.join(dir, key), secrets[key])
    );
}

const createSecretDir = (): string => {
    return fs.mkdtempSync(path.join(__dirname, 'secrets'));
}

const deleteSecretDir = (dir: string) => {
    fs.rmdirSync(dir, { recursive: true });
}
