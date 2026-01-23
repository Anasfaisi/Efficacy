/**
 * This file is used to extend the Request interface of Express.
 */

import { Role } from './role.types';

declare global {
    namespace Express {
        interface Request {
            currentUser?: {
                id: string;
                email: string;
                role: Role;
            };
            file?: Express.Multer.File;
        }
    }
}

export {};
