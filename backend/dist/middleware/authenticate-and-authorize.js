"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authenticateAndAuthorize = (_tokenService, roles) => {
    return (req, res, next) => {
        const token = req.cookies?.accessToken;
        if (!token) {
            res.status(401).json({
                message: 'Unauthorized: No token provided',
            });
            return;
        }
        try {
            const currentUser = _tokenService.verifyAccessToken(token);
            req.currentUser = currentUser;
        }
        catch {
            res.status(401).json({
                message: 'Unauthorized: Invalid or expired token',
            });
            return;
        }
        const allowedRoles = Array.isArray(roles) ? roles : [roles];
        if (allowedRoles.length > 0 &&
            (!req.currentUser || !allowedRoles.includes(req.currentUser.role))) {
            res.status(403).json({ message: 'Permission denied' });
            return;
        }
        next();
    };
};
exports.default = authenticateAndAuthorize;
//# sourceMappingURL=authenticate-and-authorize.js.map