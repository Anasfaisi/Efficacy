import { IChatMessage } from "@/models/Chat-message.model";

export interface IChatService {
    saveMessage(message:IChatMessage):Promise<IChatMessage>;
    getRoomHistory(roomId:string):Promise<IChatMessage[]>;    
}