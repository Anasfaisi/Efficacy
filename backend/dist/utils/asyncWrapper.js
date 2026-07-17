"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncWrapper = void 0;
const logMiddlewares_1 = require("./logMiddlewares");
const asyncWrapper = (controller) => (req, res, next) => {
    controller(req, res, next).catch((err) => {
        logMiddlewares_1.logger.error(err, 'it is me it ======================');
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
exports.asyncWrapper = asyncWrapper;
//# sourceMappingURL=asyncWrapper.js.map