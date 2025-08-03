import { ApplicationError } from "../modules/Application/application-error-handlers";
import HttpStatusCodes from "./http";

export interface AuthTokenPayload {
  userId: string;
  role?: string;
}

export interface GenerateAuthTokenParams {
  userId: string;

  role?: string;
}

export interface VerifyAuthTokenParams {
  token: string;
}

export class AccessTokenInvalidError extends ApplicationError {
  constructor(message: string) {
    super(message,'AccessTokenInvalidError', HttpStatusCodes.SERVER_ERROR);
  }
}

export class InvalidCredentialsError extends ApplicationError {
  constructor(message: string) {
    super(message ,'InvalidCredentialsError' ,HttpStatusCodes.UNAUTHORIZED );
  }
}
export class AccountAlreadyExistedError extends ApplicationError {
  constructor(message: string) {
    super(message ,'AccountAlreadyExistedError' ,HttpStatusCodes.CONFLICT );
  }
}

export class AccessTokenExpiredError extends ApplicationError {
  constructor() {
    super('Access token has expired' ,'AccessTokenExpiredError' ,HttpStatusCodes.UNAUTHORIZED );
  }
}

export type generateToken = {
  token: string;
}