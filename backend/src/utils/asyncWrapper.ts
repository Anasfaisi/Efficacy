import { Request, Response, NextFunction } from 'express';

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
            console.error('AsyncWrapper Error:', err);
            console.log("from async wrap",err);
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
