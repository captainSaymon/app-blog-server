import { Schema, model } from 'mongoose';
import { IUser } from '../models/user.model';

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

export default model<IUser>('User', UserSchema);