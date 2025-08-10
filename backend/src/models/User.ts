// import { Schema,model,Types} from "mongoose";

// interface IUser{
//     _id?:Types.ObjectId;
//     name: string,
//     email:string,
//     password: string,
//     refreshToken : string,
//     role:string
// }

// const userSchema = new Schema<IUser>({
//     email:{type:String,required:true,unique: true},
//     name:{type:String,required:true},
//     password:{type:String , required:true},
//     refreshToken: {type:String,default : null}
// })
// export {IUser}
// export default model<IUser>("Users",userSchema)

import { Schema, model, Document, ObjectId } from "mongoose";

interface IUser extends Document<ObjectId> {
  name: string;
  email: string;
  password: string;
  refreshToken: string | null;
  role: string;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  refreshToken: { type: String, default: null },
  role: { type: String, default: "user" },
});

export { IUser };
export default model<IUser>("Users", userSchema);
