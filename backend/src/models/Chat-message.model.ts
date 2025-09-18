import {Schema,model,Document} from "mongoose";
export interface IChatMessage extends Document{
    roomId : string;
    senderId : string;
    senderName:string;
    message:string;
    createdAt : Date
}

const ChatMessageSchema = new Schema<IChatMessage>({
    roomId:{type:String,required:true},
    senderId : {type :String,required :true},
    senderName: {type:String,required:true},
    message: {type:String,required:true},
    createdAt: {type:Date,required:true},
})


export const ChatMessage = model<IChatMessage>("chatMessage",ChatMessageSchema)
