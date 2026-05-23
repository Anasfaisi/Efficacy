import { NextFunction, Request, Response } from 'express';
import { ZodSchema, ZodError } from 'zod';
import code from '@/types/http-status.enum';
import { logger } from '@/utils/logMiddlewares';

export const validateRequest = (schema: ZodSchema) => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            req.body = await schema.parseAsync(req.body);
            next();
        } catch (error) {
            logger.error(error);
            if (error instanceof ZodError) {
                const errorMessages = error.issues.map((issue) => ({
                    message: `${issue.path.join('.')} is ${issue.message}`,
                }));
                res.status(code.BAD_REQUEST).json({
                    error: 'Validation Error',
                    details: errorMessages,
                });
                return;
            }
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
    };
};
