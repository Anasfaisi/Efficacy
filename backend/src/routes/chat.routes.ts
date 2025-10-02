import { Router } from 'express';
import { ChatController } from '@/controllers/chat.controller';

export default function chatRoutes(chatController: ChatController) {
    const router = Router();

    // router.get("/rooms/:roomId/messages",chatController.intializeSockets.bind(ChatController))
    return router;
}
