import mongoose, { Model } from "mongoose";
import { User, userSchema } from "./user-model";

interface IUserModel extends Model<User>{}

const userModel:IUserModel = mongoose.model<User, IUserModel>("User", userSchema);
export { userModel, IUserModel };