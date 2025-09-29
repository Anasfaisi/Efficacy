import { SocketController } from "@/controllers/socket.controller";
import { container } from "@/config/inversify.config";
import { TYPES } from "@/types/inversify-key.types";
import "@/config/env.config";
import {Server as HTTPServer } from "http"
import {Server as SocketIOServer} from "socket.io"

const setUpSocket = (server:HTTPServer)=>{
    try {
            const io = new SocketIOServer(server,{
        cors:{
            origin:process.env.FRONTEND_URL,
            methods:["GET","POST"],
            credentials:true,
        }
    });

    const socketController = container.get<SocketController>(TYPES.SocketController)
    socketController.initializeSockets(io)
 return io        
        
    } catch (error) {
        console.log("error from the socket setting up ", error)
    }

   
}

export default setUpSocket