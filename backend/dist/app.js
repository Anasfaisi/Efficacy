"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const middleware_1 = require("./middleware");
const routes_1 = require("./routes");
function createApp() {
    const app = (0, express_1.default)();
    (0, middleware_1.applyMiddlewares)(app);
    (0, routes_1.applyRoutes)(app);
    return app;
}
//# sourceMappingURL=app.js.map