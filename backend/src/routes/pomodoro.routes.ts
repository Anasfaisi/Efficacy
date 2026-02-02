import { Router } from 'express';
import { PomodoroController } from '../controllers/pomodoro.controller';
import authenticateAndAuthorize from '../middleware/authenticateAndAuthorize';
import { asyncWrapper } from '@/utils/asyncWrapper';
import { container } from '@/config/inversify.config';
import { TYPES } from '@/config/inversify-key.types';
import { TokenService } from '@/serivces/token.service';
import { Role } from '@/types/role.types';

export default function pomodoroRouter (pomodoroController: PomodoroController) {
    const router = Router();
const tokenService = container.get<TokenService>(TYPES.TokenService);

router.post('/log', authenticateAndAuthorize(tokenService, Role.User), asyncWrapper(pomodoroController.logSession.bind(pomodoroController)));
router.get('/stats', authenticateAndAuthorize(tokenService, Role.User), asyncWrapper(pomodoroController.getDailyStats.bind(pomodoroController)));

return router;
};
