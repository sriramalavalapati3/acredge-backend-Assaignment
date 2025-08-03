import { NextFunction, Request, Response } from "express";
import UserService from "./user-service";
import { User, UserLoginDetails } from "../types";
import HttpStatusCodes from "../../../utils/http";

export default class UserController {
    register = async (req: Request,
        res: Response, next: NextFunction): Promise<void> => {
            try {
                const userData = await UserService.registerUser(req.body as User);
                console.log('User registered successfully:', userData);
                res.status(HttpStatusCodes.CREATED).send('User registered successfully');
            } catch (error) {
                next(error);    
            }
        }

    login = async (req: Request, 
        res: Response, next: NextFunction): Promise<void> => {
            try {
                const loginData = await UserService.login(req.body as UserLoginDetails);
                console.log('User logged in successfully:', loginData);
                res.status(HttpStatusCodes.OK).json(loginData);
            } catch (error) {
                next(error);
            }   
        }
    

}