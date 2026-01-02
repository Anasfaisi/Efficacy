import { NextFunction, Request, Response } from 'express';
import { ZodSchema, ZodError } from 'zod';

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
            if (error instanceof ZodError) {
                const errorMessages = error.issues.map((issue) => ({
                    message: `${issue.path.join('.')} is ${issue.message}`,
                }));
                res.status(400).json({
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
