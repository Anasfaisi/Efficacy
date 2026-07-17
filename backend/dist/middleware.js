"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyMiddlewares = applyMiddlewares;
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const inversify_config_1 = require("./config/inversify.config");
const inversify_key_types_1 = require("./config/inversify-key.types");
const path_1 = __importDefault(require("path"));
const logMiddlewares_1 = require("./utils/logMiddlewares");
function applyMiddlewares(app) {
    const corsOptions = {
        origin: [
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:3000',
            process.env.FRONTEND_URL || 'http://localhost:5173',
        ],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    };
    app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
    app.use((0, cors_1.default)(corsOptions));
    app.use(logMiddlewares_1.morganMiddleware);
    const paymentController = inversify_config_1.container.get(inversify_key_types_1.TYPES.PaymentController);
    app.post('/api/payments/webhook', body_parser_1.default.raw({ type: 'application/json' }), paymentController.handleWebhook.bind(paymentController));
    app.use(express_1.default.json());
    app.use((0, cookie_parser_1.default)());
}
//# sourceMappingURL=middleware.js.map