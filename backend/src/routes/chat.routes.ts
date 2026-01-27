import { Router } from 'express';
import { ChatController } from '@/controllers/chat.controller';
import authenticateAndAuthorize from '@/middleware/authenticateAndAuthorize.middleware';
import { container } from '@/config/inversify.config';
import { TYPES } from '@/config/inversify-key.types';
import { TokenService } from '@/serivces/token.service';
import { Role } from '@/types/role.types';
import { asyncWrapper } from '@/utils/asyncWrapper';

export default function chatRoutes(chatController: ChatController) {
    const router = Router();
    const tokenService = container.get<TokenService>(TYPES.TokenService);

    router.post(
        '/initiate',
        authenticateAndAuthorize(tokenService, Role.User),
        asyncWrapper(chatController.initiateChat.bind(chatController))
    );

    router.get(
        '/my-conversations',
        authenticateAndAuthorize(tokenService, [Role.User, Role.Mentor]),
        asyncWrapper(chatController.getUserConversations.bind(chatController))
    );

    router.get(
        '/:roomId/messages',
        authenticateAndAuthorize(tokenService, [Role.User, Role.Mentor]),
        asyncWrapper(chatController.getRoomMessages.bind(chatController))
    );

    return router;
}
