import { Document, Schema } from 'mongoose';
import { Role } from '../types';
interface User extends Document{
    userName: string;
    email: string;
    password: string;
    phoneNumber: string;
    role: Role;
}

const userSchema = new Schema<User>({
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    role: { type: String, enum: Object.values(Role), required: true, default: Role.USER }
});

export type { User };
export { userSchema };

