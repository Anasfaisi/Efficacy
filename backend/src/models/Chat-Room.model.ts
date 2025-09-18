import {Schema,model,Document} from "mongoose";

export interface IChatRoom extends Document{
    name : string;
    createdAt:Date
}

const ChatRoomSchema = new Schema<IChatRoom>({
    name:{type:String,required:true,unique:true},
    createdAt:{type:Date,default:Date.now}
})

export const ChatRoom = model<IChatRoom>("chatRoom",ChatRoomSchema)