import { inject, injectable, } from "inversify";
import {TYPES} from "@/types/inversify-key.types"
import { ChatController } from "@/controllers/chat.controller";
import {Server,Socket} from "socket.io"
import { IChatService } from "./Interfaces/IChat-message.service";
import { IChatMessage } from "@/models/Chat-message.model";
import { SendMessagePayload } from "@/types/response-messages.types";
import { JoinRoomDto } from "@/Dto/requestDto";

@injectable()
export class SocketService{
constructor(@inject(TYPES.ChatService) private _chatService:IChatService )
{}

 public register(io: Server) {
    io.on("connection", (socket: Socket) => {
      console.log("User connected:", socket.id);

    socket.on("joinRoom", (data: { roomId: string; user: any }) => {
        const dto = new JoinRoomDto(data.roomId, data.user);
            this.handleJoinRoom(socket, dto);
  });
       socket.on("sendMessage", (payload: SendMessagePayload) =>
        this.handleSendMessage(io, socket, payload)
      );

       socket.on("disconnect", () => this.handleDisconnect(socket));
    });
}

   private async handleJoinRoom(socket:Socket,payload:JoinRoomDto){
    const {roomId,user}= payload;
    socket.join(roomId)

    const history = await this._chatService.getRoomHistory(roomId);
    socket.emit("lastMesages",history)
    socket.to(roomId).emit("userJoined",{user})
   }

   private async handleSendMessage(
    io:Server,
    socket:Socket,
    payload:SendMessagePayload
   ){
    const {roomId,senderId,senderName,message} = payload;

    const saved = await this._chatService.saveMessage({
      roomId,
      senderId,
      senderName,
      message,
      createdAt: new Date()
    } as IChatMessage)

    io.to(roomId).emit("receiveMessage",saved)
   }

  private handleDisconnect (socket:Socket){
    console.log("user disconnected",socket.id)
  }



}