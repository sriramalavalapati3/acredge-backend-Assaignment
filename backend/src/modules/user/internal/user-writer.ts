import { userModel } from "../../../models";
import { User } from "../types";

export default class UserWriter {
    static async createUser(userData: User){
        const user = new userModel({
            userName: userData.userName,
            email: userData.email,
            password: userData.password,
            phoneNumber: userData.phoneNumber,
            role: userData.role
        });
        await user.save();
        return user;
    }
}