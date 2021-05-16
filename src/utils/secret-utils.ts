import * as AWS from 'aws-sdk';

export const region =  'us-east-1';

const client = new AWS.SecretsManager({
  region
});

export function getSecret(secretName = 'book-store-app'): Promise<string> {
  return client.getSecretValue({ SecretId: secretName }).promise().then(data => data.SecretString);
}

export async function getJsonSecret(key: string, secretName = `book-store-app`): Promise<string> {
  return client.getSecretValue({ SecretId: secretName }).promise().then(data => JSON.parse(data.SecretString || '')[key]);
}
