import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '@/types/role.types';
const authenticateAndAuthorize = (roles?: typeof Role) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const JWT_SECRET = process.env.JWT_SECRET;

        if (!JWT_SECRET) {
            res.status(500).json({ message: 'Internal server error' });
            return;
        }

        jwt.verify(token, JWT_SECRET, async (err, user) => {
            if (err) {
                next(err);
                return;
            }

            req.user = user as Request['user'];

            if (roles && (!req.user || !roles.includes(req.user.role))) {
                res.status(403).json({ message: 'Permission denied' });
                return;
            }
            next();
        });
    };
};

export default authenticateAndAuthorize;
