import { getJsonSecret } from '../../../utils/secret-utils';
import { ICognitoUserPoolData } from 'amazon-cognito-identity-js';

export class CognitoService {
  static setup(): Promise<ICognitoUserPoolData> {
    return Promise.all([
      getJsonSecret('USER_POOL_ID'),
      getJsonSecret('APP_CLIENT_ID')
    ]).then(data => ({
      UserPoolId: data[0],
      ClientId: data[1]
    }));
  }
};
