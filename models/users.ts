import mongoose, { Schema } from "mongoose";

const schema = new Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
},{versionKey:false});

export const Users = mongoose.model("Users", schema);