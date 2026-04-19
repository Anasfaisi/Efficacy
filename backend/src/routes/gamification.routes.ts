import express, { Router } from 'express';
import { GamificationController } from '../controllers/Gamification/gamification.controller';
import authenticateAndAuthorize from '@/middleware/authenticateAndAuthorize';
import { Role } from '@/types/role.types';
import { ITokenService } from '@/serivces/Interfaces/IToken.service';
import { asyncWrapper } from '@/utils/asyncWrapper';

export default function gamificationRoutes(
    gamificationController: GamificationController,
    tokenService: ITokenService
): Router {
    const router = express.Router();

    router.post(
        '/badges',
        authenticateAndAuthorize(tokenService, [Role.Admin]),
        asyncWrapper(
            gamificationController.createBadge.bind(gamificationController)
        )
    );

    router.get(
        '/badges',
        authenticateAndAuthorize(tokenService, [Role.Admin]),
        asyncWrapper(
            gamificationController.getAllBadges.bind(gamificationController)
        )
    );

    router.get(
        '/badges/:id',
        authenticateAndAuthorize(tokenService, [Role.Admin]),
        asyncWrapper(
            gamificationController.getBadgeById.bind(gamificationController)
        )
    );

    router.put(
        '/badges/:id',
        authenticateAndAuthorize(tokenService, [Role.Admin]),
        asyncWrapper(
            gamificationController.updateBadge.bind(gamificationController)
        )
    );

    router.delete(
        '/badges/:id',
        authenticateAndAuthorize(tokenService, [Role.Admin]),
        asyncWrapper(
            gamificationController.deleteBadge.bind(gamificationController)
        )
    );

    router.get(
        '/constants',
        authenticateAndAuthorize(tokenService, [Role.Admin]),
        asyncWrapper(
            gamificationController.getGamificationConstants.bind(
                gamificationController
            )
        )
    );

    return router;
}
