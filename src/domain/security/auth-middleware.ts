import { Request, Response } from 'express';
import { JWK } from 'jwk-to-pem';
import * as jwkToPem from 'jwk-to-pem';
import * as jwt from 'jsonwebtoken';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { getJsonSecret } from '../../utils/secret-utils';
import logger from '../../logger';

class AuthMiddleware {
  public validateToken(req: Request, res: Response, next: any) {
    logger.info('----------------validateToken begin----------------')
    const unauthorized = () => {
      res.status(401);
      return res.send('unauthorized');
    };

    const token = req.headers['authorization'];
    getJsonSecret('PUBLIC_KEY')
      .then(publicKey => {
        const publicKeyJson = JSON.parse(publicKey);
        const keys = publicKeyJson.keys;
        const pems: any = {};
        for (let i = 0; i < keys.length; i++) {
          const keyId = keys[i].kid;
          const modulus = keys[i].n;
          const exponent = keys[i].e;
          const keyType = keys[i].kty;
          const jwk = { kty: keyType, n: modulus, e: exponent } as JWK;
          const pem = jwkToPem.default(jwk);
          pems[keyId] = pem;
        }
        const decodedJwt: any = jwt.decode(token, { complete: true });
        if (!decodedJwt) {
          unauthorized();
        }

        const kid = decodedJwt.header.kid;
        const pem = pems[kid];
        if (!pem) {
          unauthorized();
        }
        return jwt.verify(token, pem, (err: any, payload: any) => {
          if (err) {
            unauthorized();
          }
          const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();
          return cognitoIdentityServiceProvider.getUser({
              AccessToken: token
            }).promise().then((cognitoUser) => {
                console.log(cognitoUser)
              req.query.userInfo = {};
              const attributes = {
                nickname: cognitoUser?.UserAttributes?.find(e => e.Name === 'nickname')?.Value,
                phone_number: cognitoUser?.UserAttributes?.find(e => e.Name === 'phone_number')?.Value,
                userName: cognitoUser?.UserAttributes?.find(e => e.Name === 'userName')?.Value,
                picture: cognitoUser?.UserAttributes?.find(e => e.Name === 'picture')?.Value,
                address: cognitoUser?.UserAttributes?.find(e => e.Name === 'address')?.Value,
                default_language: cognitoUser?.UserAttributes?.find(e => e.Name === 'default_language')?.Value,
                email: cognitoUser?.UserAttributes?.find(e => e.Name === 'email')?.Value
              };
              Object.assign(req.query.userInfo, {
                nickname: attributes.nickname,
                phone_number: attributes.phone_number,
                userName: attributes.userName,
                picture: attributes.picture,
                address: attributes.address,
                default_language: attributes.default_language,
                cognitoUserId: payload.sub
              });
              return next();
            })
            .catch(() => {
              unauthorized();
            });
        });
      })
      .catch(() => {
        unauthorized();
      });
  }
}

export = new AuthMiddleware();
