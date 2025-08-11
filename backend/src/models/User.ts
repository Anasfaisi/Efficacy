import { Schema, model, Document, ObjectId } from "mongoose";

interface IUser extends Document<ObjectId> {
  name: string;
  email: string;
  password: string;
  role: string;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
});

export { IUser };
export default model<IUser>("Users", userSchema);
