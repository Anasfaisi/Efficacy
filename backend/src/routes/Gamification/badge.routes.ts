import {Router} from 'express'
import { BadgeController } from '@/controllers/Gamification/badge.controller';
import authenticateAndAuthorize from '@/middleware/authenticateAndAuthorize';
import { Role } from '@/types/role.types';
import { ITokenService } from '@/serivces/Interfaces/IToken.service';

export default function BadgeRoutes(badgeController : BadgeController , tokenService : ITokenService){
    const router = Router()
    router.post('/',authenticateAndAuthorize(tokenService,[Role.Admin]),badgeController.CreateBadge.bind(badgeController))
    router.get('/',authenticateAndAuthorize(tokenService,[Role.Admin]),badgeController.getAllBadges.bind(badgeController))
    router.get('/:badgeId',authenticateAndAuthorize(tokenService,[Role.Admin]),badgeController.getBadgeById.bind(badgeController))
    router.put('/:badgeId',authenticateAndAuthorize(tokenService,[Role.Admin]),badgeController.updateBadge.bind(badgeController))
    return router
}
