import { Schema, model } from "mongoose";
const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    refreshToken: { type: String, default: null }
});
export default model("Users", userSchema);
