import { CognitoIdentityServiceProvider, config } from 'aws-sdk';
import {
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUserAttribute,  
  ISignUpResult,
  CognitoUser
} from 'amazon-cognito-identity-js';
import { CognitoService } from './cognito-services';
import { region } from '../../../utils/secret-utils';

export class AuthService {
    private config = config;
    private cognitoIdentityServiceProvider: CognitoIdentityServiceProvider;

    constructor() {
      this.config.update({
        region
      });
      this.cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();
    }
    login(userName: string, password: string) {
        return CognitoService.setup()
          .then(poolData => {
            const userPool = new CognitoUserPool(poolData);
    
            return new Promise((resolve, reject) => {
              const authenticationDetails = new AuthenticationDetails({
                Username: userName,
                Password: password
              });
    
              const cognitoUser = new CognitoUser({
                Pool: userPool,
                Username: userName
              });
    
              cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: async result => {
                  resolve({
                    accessToken: result.getAccessToken().getJwtToken(),
                    accessTokenExpiration: result.getAccessToken().getExpiration() * 1000,
                    refreshToken: result.getRefreshToken().getToken()
                  });
                },
                onFailure: err => {
                  if (err.code === 'NotAuthorizedException') {
                    if (err.message === 'Incorrect username or password.') {
                      return reject(new Error('Your Email or Password is incorrect. Please check again.'));
                    }
                    if (err.message === 'User is disabled.') {
                      return reject(new Error('This account has been deleted. Please contact admin for more information.'));
                    }
                  }
                  return reject(err);
                }
              });
            });
          });
      }

      register(user: any) {
        return CognitoService.setup()
          .then(poolData => {
            const userPool = new CognitoUserPool(poolData);
    
            // find cognito user by email
            return this.cognitoIdentityServiceProvider.listUsers({
              UserPoolId: poolData.UserPoolId,
              Filter: `email = "${user.username}"`
            }).promise()
              .then(users => {
                // Check user is invited
                if (users && users.Users && users.Users.length && users.Users[0].UserStatus === 'FORCE_CHANGE_PASSWORD') {
                  // If user didn't click to link in email then return error
                  if (!user.memberId) {
                    throw new Error('There has been an account using this email. Please login to your email for more information.');
                  }
    
                  // Create new password
                  return this.cognitoIdentityServiceProvider.adminSetUserPassword({
                    Username: users.Users[0].Username,
                    UserPoolId: poolData.UserPoolId,
                    Permanent: true,
                    Password: user.password
                  }).promise()
                    .then(() => this.cognitoIdentityServiceProvider.adminUpdateUserAttributes({
                      Username: users.Users[0].Username,
                      UserPoolId: poolData.UserPoolId,
                      UserAttributes: [
                        {
                          Name: 'name',
                          Value: user.fullName
                        }
                      ]
                    }).promise())
                    //  change status for invited member
                    .then(() => ({ message: 'Successful registration, a verification link has been sent to your email' }));
                }
                return new Promise((resolve, reject) => {
                  const attributeList = [];
                  attributeList.push(new CognitoUserAttribute({ Name: 'email', Value: user.userName }));
                  attributeList.push(new CognitoUserAttribute({ Name: 'nickname', Value: user.nickname }));
                  attributeList.push(new CognitoUserAttribute({ Name: 'picture', Value: user.picture }));
                  attributeList.push(new CognitoUserAttribute({ Name: 'phone_number', Value: user.phone_number }));
                  attributeList.push(new CognitoUserAttribute({ Name: 'address', Value: user.address }));
                  attributeList.push(new CognitoUserAttribute({ Name: 'default_language', Value: user.default_language }));
                  userPool.signUp(user.userName, user.password, attributeList, null, (err: Error, result: ISignUpResult) => {
                    if (err) {
                      reject(err);
                    } else {
                      resolve({ message: 'Successful registration, a verification link has been sent to your email' });
                    }
                  });
                });
              });
          });
      }
}