import {Router} from 'express'
import { BadgeController } from '@/controllers/Gamification/badge.controller';
import authenticateAndAuthorize from '@/middleware/authenticateAndAuthorize';
import { Role } from '@/types/role.types';
import { ITokenService } from '@/serivces/Interfaces/IToken.service';

export default function BadgeRoutes(badgeController : BadgeController , tokenService : ITokenService){
    const router = Router()
    router.post('/',authenticateAndAuthorize(tokenService,[Role.ADMIN]),badgeController.CreateBadge)
    router.get('/',authenticateAndAuthorize(tokenService,[Role.ADMIN]),badgeController.getAllBadges)
    router.get('/:badgeId',authenticateAndAuthorize(tokenService,[Role.ADMIN]),badgeController.getBadgeById)
    router.put('/:badgeId',authenticateAndAuthorize(tokenService,[Role.ADMIN]),badgeController.updateBadge)
    return router
}
