import z from "zod";
import { Role } from "../../types";
import { ApplicationError } from "../Application/application-error-handlers";
import HttpStatusCodes from "../../utils/http";

export type User = {
    userName: string;
    email: string;
    password: string;
    phoneNumber: string;
    role: Role;
}

export type UserLoginDetails = {
    email: string;
    password: string;
}

export const userDetailsSchema = z.object({
    userName: z.string().min(1, "User name is required"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits long"),
    role: z.nativeEnum(Role).default(Role.USER)
});

export enum UserAccountErrorCode {
  NOT_FOUND = 'UserAccount_ERR_01',
  BAD_REQUEST = 'UserAccount_ERR_02',
}

export class UserAccountBadRequestError extends ApplicationError{
  constructor(message: string) {
    super(message, UserAccountErrorCode.BAD_REQUEST, HttpStatusCodes.BAD_REQUEST);
  }
}

export class UserAccountNotFoundError extends ApplicationError{
  constructor(message: string) {
    super(message, UserAccountErrorCode.NOT_FOUND, HttpStatusCodes.NOT_FOUND);
  }
}

export class UserAlreadyExistsError extends ApplicationError {
  constructor(message: string) {
    super(message, 'UserAccount_ERR_03', HttpStatusCodes.CONFLICT);
  }
}

