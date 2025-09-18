import {Server,Socket} from "socket.io"
import { TYPES } from "@/types/symbol-key"
import { inject, injectable } from "inversify"
import { IChatService } from "@/serivces/Interfaces/IChat-message.service"
import { ISocketService } from "@/serivces/Interfaces/ISocket.service"
import { Request, Response } from "express"

@injectable()
export class ChatController{
constructor(@inject(TYPES.ChatService) private _chatService:IChatService,
@inject(TYPES.SocketService) private _socketService:ISocketService
){}

async intializeSockets(io:Server){
    this._socketService.register(io)
}
  async getRoomMessages(req: Request, res: Response) {
    const { roomId } = req.params;
    const messages = await this._chatService.getRoomHistory(roomId);
    return res.json(messages);
  }

}