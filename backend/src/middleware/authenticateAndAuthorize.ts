import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '@/types/role.types';
import { TokenService } from '@/serivces/token.service';
const authenticateAndAuthorize = (
    _tokenService: TokenService,
    roles: Role | Role[]
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies?.accessToken;
        if (!token) {
            res.status(403).json({ message: 'Unauthorized' });
            return;
        }

        const user = _tokenService.verifyAccessToken(token);

        req.user = user;
        const allowedRoles = Array.isArray(roles) ? roles : [roles];

        if (
            allowedRoles.length > 0 &&
            (!req.user || !allowedRoles.includes(req.user.role))
        ) {
            res.status(403).json({ message: 'Permission denied' });
            return;
        }
        next();
    };
};

export default authenticateAndAuthorize;
