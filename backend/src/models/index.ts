import mongoose, { Model } from "mongoose";
import { User, userSchema } from "./user-model";
import { property, propertySchema } from "./property-model";

interface IUserModel extends Model<User>{}
interface IPropertyModel extends Model<property>{}

const userModel:IUserModel = mongoose.model<User, IUserModel>("User", userSchema);
const propertyModel:IPropertyModel = mongoose.model<property, IPropertyModel>("Property", propertySchema);


export {
  userModel,
  IUserModel,
  propertyModel,
  IPropertyModel,
};
