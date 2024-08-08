import mongoose, { Schema, model, Document } from "mongoose";
import { IUser } from "./user-model";
export interface IToken extends Document {
    user: IUser['_id'];
    refreshToken: string;
}

const TokenSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    refreshToken: { type: String, require: true },
}, { versionKey: false });

export const TokenModel = model("Token", TokenSchema);