import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { AccessTokenExpiredError, AccessTokenInvalidError, AuthTokenPayload, GenerateAuthTokenParams, generateToken, VerifyAuthTokenParams } from './types';

export default class AuthTokenUtil {
    private static readonly TOKEN_EXPIRY_DAYS = 7;
  // Generate Token
  public static generateAuthToken(params: GenerateAuthTokenParams): generateToken  {
    const jwtSigningKey= process.env.JWT_SECRET as Secret;

    const payload: AuthTokenPayload = {
      userId: params.userId ,
      ...(params.role && {role: params.role})
    };

    return {token: jwt.sign(payload, jwtSigningKey, { expiresIn: '7d' }), };
  }

  public static verifyAuthToken(params: VerifyAuthTokenParams): AuthTokenPayload {
    const { token } = params;
    const jwtSigningKey= process.env.JWT_SECRET as Secret;

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, jwtSigningKey) as JwtPayload;
    } catch (error) {
      throw new AccessTokenInvalidError(`Invalid token: ${(error as Error).message}`);
    }

    if (!decoded.exp || decoded.exp * 1000 < Date.now()) {
      throw new AccessTokenExpiredError();
    }

    return {
      userId: decoded.userId as string,
      role: decoded.role as string
    };
  }
}
