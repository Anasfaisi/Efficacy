import { Request, Response, NextFunction } from 'express';
import { logger } from './logMiddlewares';

export const asyncWrapper =
    (
        controller: (
            req: Request,
            res: Response,
            next: NextFunction
        ) => Promise<void>
    ) =>
    (req: Request, res: Response, next: NextFunction) => {
        controller(req, res, next).catch((err) => {
            logger.error(err);
            if (err instanceof Error) {
                res.status(500).json({
                    message: err.message,
                });
                return;
            }

            res.status(500).json({
                message: 'An unexpected error occurred',
            });
        });
    };
