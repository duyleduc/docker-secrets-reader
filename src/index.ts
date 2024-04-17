import {existsSync, readdirSync, lstatSync, readFileSync} from 'fs';
import path from 'path';

const DEFAULT_SECRETS_DIR = '/run/secrets';

export interface Secrets { 
    [key: string]: string;
}

/**
 * Retrieves secrets stored in files within a directory or a default directory.
 * @template T The type of secrets object to return.
 * @param {string} [secretsDir] The directory path where secrets are stored. If not provided, uses the default directory.
 * @returns {T} An object containing the secrets, where keys are file names and values are the content of the files.
 */
export function getSecrets<T extends Secrets = Secrets>(secretsDir?: string): T {
    // Determine the directory path for secrets
    const _secretDir = secretsDir || DEFAULT_SECRETS_DIR;

    // Initialize an empty object to store secrets
    const secrets: Secrets = {};

    // Check if the specified directory exists
    if (existsSync(_secretDir)) {
        // Iterate through files in the directory
        readdirSync(_secretDir).forEach((file) => {
            const fullPath = path.join(_secretDir, file);

            // Check if the current path points to a directory, skip if it does
            if (lstatSync(fullPath).isDirectory()) {
                return;
            }

            // Read the content of the file and trim it, then store it in the secrets object
            secrets[file] = readFileSync(fullPath, 'utf8').trim();
        });
    }

    // Return the secrets object with the appropriate type
    return secrets as T;
}


/**
 * Retrieves a secret from either a file or an environment variable.
 * @param secretName The name of the secret to retrieve.
 * @param defaultValue An optional default value to return if the secret is not found.
 * @returns The value of the secret if found, or the defaultValue if provided, otherwise undefined.
 */
export function getSecret(secretName: string, defaultValue?: any): any {
    try {
        // Attempt to read the secret from a file
        const secretValue = readFileSync(path.join(secretName), 'utf8').trim();
        return secretValue;
    } catch (err) {
        // If reading from file fails, fallback to environment variable
        // If environment variable is not set, fallback to defaultValue
        return process.env[`${secretName}`] || defaultValue;
    }
}

/**
 * Default secrets
 */
export const secrets = getSecrets();
