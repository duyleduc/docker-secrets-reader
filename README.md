**Module Name: Docker Secrets Reader**

**Description:**
The Docker Secrets Reader is a lightweight Node.js module designed to simplify the process of accessing Docker secrets within Docker containers. Docker secrets are sensitive data such as passwords, API keys, and other confidential information stored securely within Docker Swarm or Docker Compose.

**Key Features:**

1. **Easy Integration:** Seamlessly integrates into Node.js applications running within Docker containers, providing a convenient interface for accessing Docker secrets.

2. **Simple API:** Offers a simple and intuitive API for reading Docker secrets, abstracting away the complexities of interacting with Docker's secret management system.

3. **Environment Variable Support:** Provides support for accessing Docker secrets through environment variables, allowing developers to easily inject secrets into their applications.

**Installation:**
```bash
npm install --save docker-secrets-reader
```

**Usage:**
Created your docker secret for a docker swarm 
```shell
printf "mysql_username" | docker secret create mysql_username - 
printf "mysql_password" | docker secret create mysql_password -
```

You can retrieve secrets via the following methods:

### `secrets`
```ts
import {secrets} from 'docker-secrets-reader';

console.log(secrets.mysql_username);
console.log(secrets.mysql_password);
```
### `getSecrets<Secrets>(dir?: string): Secrets`
You can read secrets from a directory you define. This is useful for loading secrets from a different directory during development.

By default, the secret dir is at `/run/secrets`

```ts
import { getSecrets } from "docker-secrets-reader";

// Without typings works fine
const secrets = getSecrets(process.env.SECRET_DIR);

secrets.USERNAME; // no error
secrets.PASSWORD; // no error
secrets.RANDOM; // no error

// But using with typings is preferred
type Credentials = {
  USERNAME: string;
  PASSWORD: string;
};

# Passing a custom secret dir
const secrets = getSecrets<Credentials>(process.env.SECRET_DIR);

secrets.USERNAME; // no error
secrets.PASSWORD; // no error
secrets.RANDOM; // error

# Default secret folder
const secrets = getSecrets<Credentials>();
```

### `getSecret(): string`
You can read an individual environment variable via function `getSecret()`
This function takes an environment variable and an optional default value. 

This function returns in the order:
    - value of the file of `process.env.variable`.
    - value of `process.env.variable` if exists.
    - value of `default value` if `process.env.variable` not exists.

```ts
import {getSecret} from "docker-secrets-reader";

const secret = getSecret(process.env.SECRET); 
const secretWithDefaultValue = getSecet(process.env.SECRET, "default_value");
```

**Compatibility:**
- Compatible with Node.js applications running in Docker containers.
- Works with Docker Swarm and Docker Compose for managing secrets.

**Dependencies:**
- No external dependencies.

**License:**
This module is open-source software licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

Feel free to adjust the description as needed to better fit the specifics of your module!
