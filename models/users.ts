import mongoose, { Schema } from "mongoose";

export interface IUser  {
    username: string;
    password: string;
    name: string;
  }

const schema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
}, { versionKey: false });

export const Users = mongoose.model("Users", schema);