import mongoose, { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
    username: string;
    password: string;
    name: string;
    id:string;
}

const UserSchema = new Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
}, { versionKey: false });

export const UsersModel = model("Users", UserSchema);