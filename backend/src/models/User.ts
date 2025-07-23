import { Schema,model,Types} from "mongoose";

interface IUser{
    _id?:Types.ObjectId;
    name: string,
    email:string,
    password: string,
    refreshToken : string,
    role:string
}

const userSchema = new Schema<IUser>({
    email:{type:String,required:true,unique: true},
    name:{type:String,required:true},
    password:{type:String , required:true},
    refreshToken: {type:String,default : null}
})
export {IUser}
export default model<IUser>("Users",userSchema)