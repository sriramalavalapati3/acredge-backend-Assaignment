import UserReader from "../internal/user-reader";
import bcrypt from "bcrypt";
import { User, UserAccountBadRequestError, UserAlreadyExistsError, userDetailsSchema, UserLoginDetails } from "../types";
import UserWriter from "../internal/user-writer";
import AuthTokenUtil from "../../../utils/auth";

export default class UserService {
    static async registerUser(userData: User){
        const res = userDetailsSchema.safeParse(userData);
    if (res.success === false) {
      const errMessage = res.error.issues.map((obj) => (`{ Key: ${obj.path.join('.')},  Error code: ${obj.code}, Error message: ${obj.message} }`)).join('; ');
      throw new UserAccountBadRequestError(`Invalid request : ${errMessage}`);
    }

    const user = await UserReader.getUserByEmail(userData.email);
    if(user){
        throw new UserAlreadyExistsError(`User with email ${userData.email} already exists`);
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;
    const newUser = await UserWriter.createUser(userData);
    return newUser;
    }

    static async login(userData: UserLoginDetails){
        const login  = await UserReader.getUserByEmail(userData.email);
        if(!login){
            throw new UserAccountBadRequestError(`User Account Not Found`);
        }
        const isPasswordValid = await bcrypt.compare(userData.password, login.password);
        if(!isPasswordValid){
            throw new UserAccountBadRequestError(`Invalid password for user ${userData.email}`);
        }
        const authToken = AuthTokenUtil.generateAuthToken({ userId: login._id as string, role: login.role });
        let { password, ...userDetails } = login;
        return {
            ...userDetails,
            ...authToken
        }

    }
}