import { container } from '@/config/inversify.config';
import { KanbanController } from '@/controllers/Kanban.controller';
import authenticateAndAuthorize from '@/middleware/authenticateAndAuthorize.middleware';
import { TokenService } from '@/serivces/token.service';
import { TYPES } from '@/config/inversify-key.types';
import { Role } from '@/types/role.types';
import { Router } from 'express';
import { asyncWrapper } from '@/utils/asyncWrapper';

export default function KanbanRoutes(kanbanController: KanbanController) {
    const router = Router();
    const tokenService = container.get<TokenService>(TYPES.TokenService);

    router.post(
        '/board',
        authenticateAndAuthorize(tokenService, Role.User),
        asyncWrapper(kanbanController.getKanbanBoard.bind(kanbanController))
    );

    router.post(
        '/task/add',
        authenticateAndAuthorize(tokenService, Role.User),
        kanbanController.addKanbanTask.bind(kanbanController)
    );
    router.put(
        '/task/update',
        authenticateAndAuthorize(tokenService, Role.User),
        kanbanController.updateKanbanTask.bind(kanbanController)
    );

    router.delete(
        '/task/delete/:id',
        authenticateAndAuthorize(tokenService, Role.User),
        kanbanController.deleteKanbanTask.bind(kanbanController)
    );

    router.put(
        '/task/reorder',
        authenticateAndAuthorize(tokenService, Role.User),
        kanbanController.reorderKanbanTask.bind(kanbanController)
    );

    return router;
}
