import {Router} from 'express'
import { BadgeController } from '@/controllers/Gamification/badge.controller';
import authenticateAndAuthorize from '@/middleware/authenticateAndAuthorize';
import { Role } from '@/types/role.types';
import { ITokenService } from '@/serivces/Interfaces/IToken.service';
import { asyncWrapper } from '@/utils/asyncWrapper';

export default function BadgeRoutes(badgeController : BadgeController , tokenService : ITokenService){
    const router = Router()
    router.post('/',authenticateAndAuthorize(tokenService,[Role.Admin]),asyncWrapper(badgeController.CreateBadge.bind(badgeController)))
    router.get('/',authenticateAndAuthorize(tokenService,[Role.Admin]),asyncWrapper(badgeController.getAllBadges.bind(badgeController)))
    router.get('/:badgeId',authenticateAndAuthorize(tokenService,[Role.Admin]),asyncWrapper(badgeController.getBadgeById.bind(badgeController)))
    router.put('/:badgeId',authenticateAndAuthorize(tokenService,[Role.Admin]),asyncWrapper(badgeController.updateBadge.bind(badgeController)))
    router.patch('/:badgeId/toggle-status',authenticateAndAuthorize(tokenService,[Role.Admin]),asyncWrapper(badgeController.toggleBadgeStatus.bind(badgeController)))
    return router
}
