"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./app");
const db_1 = __importDefault(require("./config/db"));
const socket_setup_socket_1 = __importDefault(require("./socket/socket-setup.socket"));
// import { cronJob } from './utils/cron-job.service';
const PORT = process.env.PORT;
const startServer = async () => {
    const app = (0, app_1.createApp)();
    await (0, db_1.default)();
    const server = app.listen(PORT, () => {
        console.log('Server is listening on the http://localhost: ', PORT);
    });
    (0, socket_setup_socket_1.default)(server);
    // cronJob();
};
startServer();
//# sourceMappingURL=server.js.map