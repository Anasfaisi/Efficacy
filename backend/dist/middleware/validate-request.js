"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const zod_1 = require("zod");
const logMiddlewares_1 = require("@/utils/logMiddlewares");
const validateRequest = (schema) => {
    return async (req, res, next) => {
        try {
            req.body = await schema.parseAsync(req.body);
            next();
        }
        catch (error) {
            logMiddlewares_1.logger.error(error);
            if (error instanceof zod_1.ZodError) {
                const errorMessages = error.issues.map((issue) => ({
                    message: `${issue.path.join('.')} is ${issue.message}`,
                }));
                res.status(400 /* code.BAD_REQUEST */).json({
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
exports.validateRequest = validateRequest;
//# sourceMappingURL=validate-request.js.map