import { userModel } from "../../../models";

export default class UserReader {
    static async getUserByEmail(email: string){
        const user = await userModel.findOne({email}).lean();
        return user;
    }
}