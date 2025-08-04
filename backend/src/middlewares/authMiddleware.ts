import { NextFunction, Request, Response } from "express";
import { ApplicationError } from "../modules/Application/application-error-handlers";
import AuthTokenUtil from "../utils/auth";
import _ from "lodash";
interface AuthTokenPayload {
  userId: string;
  role?: string;
}

export const authMiddleware = (
  req: Request & { userId?: string; role: string },
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new ApplicationError(
      'Authorization header not found',
      'NOT_FOUND',
      404
    );
  }

  const [authScheme, authToken] = authHeader.split(' ');
  if (authScheme !== 'Bearer' || _.isEmpty(authToken)) {
    throw new ApplicationError(
      `Invalid authorization header. Expected format is "Bearer <token>`,
      'INVALID_TOKEN',
      401
    );
  }

  try {
    // authToken is checked above, so we can safely assert it's a string
    const authPayload = AuthTokenUtil.verifyAuthToken({ token: authToken! }) as AuthTokenPayload;

   
    if (req.params.userId && authPayload.userId !== req.params.userId) {
      throw new ApplicationError(
      "This token is not authorized to access the given user resource",
      'INVALID_TOKEN',
      401
    );
    }
    req.userId = authPayload.userId;
    req.role = authPayload.role!;


    next();
  } catch (error) {
    throw new ApplicationError(
      "Invalid or expired token",
      'INVALID_TOKEN',
      402
    );
  }
};

export const authorizeAccess = (...allowedRoles: string[]) => {
  return (req: Request & { userId?: string; role?: string }, res: Response, next: NextFunction) => {
    if (!req.userId || !allowedRoles.includes(req.role!)) {
      throw new ApplicationError(
        'Forbidden: Insufficient role',
        'FORBIDDEN',
        403
      );
    }
    next();
  };
};