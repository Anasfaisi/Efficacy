import { container } from '@/config/inversify.config';
import { KanbanController } from '@/controllers/Kanban.controller';
import authenticateAndAuthorize from '@/middleware/authenticateAndAuthorize';
import { TokenService } from '@/serivces/token.service';
import { TYPES } from '@/config/inversify-key.types';
import { Role } from '@/types/role.types';
import { Router } from 'express';

export default function KanbanRoutes(kanbanController: KanbanController) {
    const router = Router();
    const tokenService = container.get<TokenService>(TYPES.TokenService);

    router.post(
        '/board',
        authenticateAndAuthorize(tokenService, Role.User),
        kanbanController.getKanbanBoard.bind(kanbanController)
    );
    return router;
}
