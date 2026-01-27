import { container } from '@/config/inversify.config';
import { PlannerTaskController } from '@/controllers/planner-task.controller';
import authenticateAndAuthorize from '@/middleware/authenticateAndAuthorize.middleware';
import { TokenService } from '@/serivces/token.service';
import { TYPES } from '@/config/inversify-key.types';
import { Role } from '@/types/role.types';
import { Router } from 'express';
import { asyncWrapper } from '@/utils/asyncWrapper';

export default function PlannerTaskRoutes(controller: PlannerTaskController) {
    const router = Router();
    const tokenService = container.get<TokenService>(TYPES.TokenService);

    const auth = authenticateAndAuthorize(tokenService, [
        Role.User,
        Role.Mentor,
    ]);

    router.post(
        '/',
        auth,
        asyncWrapper(controller.createTask.bind(controller))
    );
    router.get('/', auth, asyncWrapper(controller.getTasks.bind(controller)));
    router.put(
        '/:taskId',
        auth,
        asyncWrapper(controller.updateTask.bind(controller))
    );
    router.delete(
        '/:taskId',
        auth,
        asyncWrapper(controller.deleteTask.bind(controller))
    );

    return router;
}
