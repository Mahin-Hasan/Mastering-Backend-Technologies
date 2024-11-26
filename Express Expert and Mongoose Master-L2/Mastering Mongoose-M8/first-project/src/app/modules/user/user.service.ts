import { Schema } from "mongoose";

const userSchema = new Schema({
    id:{type: String, required:true},
    password:{type: String, required:true},
    needsPasswordChange:{type: Boolean, default:true},
})